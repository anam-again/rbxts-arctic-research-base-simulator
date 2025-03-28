import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players } from "@rbxts/services";
import { GuiAdornmentService } from "../services/GuiAdornmentService";


interface Snowmobile extends Instance {
    VehicleSeat: VehicleSeat;
    HasRearBox: BoolValue;
    HasAnomaly: BoolValue;
    SnowmobileRearBoxModel: Folder & {
        Base: Part & {
            ProximityPrompt: ProximityPrompt
            Anomaly: Part & {
                ParticleEmitter: ParticleEmitter;
            }
        }
    },
    ActivateAnomaly: BindableEvent;
    DeactivateAnomaly: BindableEvent;
}

@Component({ tag: TAGS.SnowmobileComponent })
export class SnowmobileComponent extends BaseComponent<{}, Snowmobile> implements OnStart {

    constructor(private GuiAdornmentSerice: GuiAdornmentService) {
        super();
    }

    onStart() {
        const rss1 = this.instance.VehicleSeat.GetPropertyChangedSignal('Occupant').Connect(() => {
            if (!this.instance || !this.instance.VehicleSeat) return;
            const occupant = this.instance.VehicleSeat.Occupant as Humanoid;
            if (occupant) {
                const player = Players.GetPlayerFromCharacter(occupant.Parent)
                if (player) {
                    this.instance.VehicleSeat.SetNetworkOwner(player);
                }
            } else {
                this.instance.VehicleSeat.SetNetworkOwner();
            }
        })
        this.instance.Destroying.Connect(() => {
            rss1.Disconnect();
        })
        this.instance.SnowmobileRearBoxModel.Base.ProximityPrompt.Triggered.Connect((player) => {
            const box = player.Character?.FindFirstChild('SnowmobileRearBoxTool')
            if (box && box.IsA('Tool')) {
                box.Destroy();
                this.instance.HasRearBox.Value = true;
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Installed Snowmobile Rear Box!',
                    textColor: new Color3(0.1, 0.1, 0.81),
                    textStrokeColor: new Color3(1, 1, 1)
                })
                this.instance.SnowmobileRearBoxModel.GetChildren().forEach((child) => {
                    if (child.IsA('Part')) {
                        child.Transparency = 0;
                    }
                })
            }
        })
        this.instance.ActivateAnomaly.Event.Connect(() => {
            this.instance.SnowmobileRearBoxModel.Base.Anomaly.Transparency = 0;
            this.instance.SnowmobileRearBoxModel.Base.Anomaly.ParticleEmitter.Enabled = true;
            this.instance.HasAnomaly.Value = true;
        })
        this.instance.DeactivateAnomaly.Event.Connect(() => {
            this.instance.SnowmobileRearBoxModel.Base.Anomaly.Transparency = 1;
            this.instance.SnowmobileRearBoxModel.Base.Anomaly.ParticleEmitter.Enabled = false;
            this.instance.HasAnomaly.Value = false;
        })

    }

}