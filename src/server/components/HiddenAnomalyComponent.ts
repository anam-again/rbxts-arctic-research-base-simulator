import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players, TweenService } from "@rbxts/services";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";
import { createGUID } from "shared/utils/guid";


interface HiddenAnomaly extends Part {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.HiddenAnomalyComponent })
export class HiddenAnomalyComponent extends BaseComponent<{}, HiddenAnomaly> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            const snowmobile = player.Character?.FindFirstChildOfClass('Humanoid')?.SeatPart?.Parent as Model;
            if (!snowmobile || snowmobile.Name !== 'Snowmobile') return;
            const hasRearBox = snowmobile.FindFirstChild('HasRearBox') as BoolValue;
            if (!hasRearBox) return;
            if (hasRearBox.Value === true) {
                const event = snowmobile.FindFirstChild('ActivateAnomaly') as BindableEvent;
                if (event) {
                    this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                        richText: 'Put Anomaly In Snowmobile!',
                        textColor: new Color3(0.19, 0.94, 0.84),
                        textStrokeColor: new Color3(0, 0, 0)
                    })
                    this.PlayerExperienceService.giveDoubletappedExperience(player, 150, 60000, this.id);
                    event.Fire();
                }
            }
        })
    }

}