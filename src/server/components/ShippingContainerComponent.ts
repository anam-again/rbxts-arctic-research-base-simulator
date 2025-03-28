import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { InsertService, Players, TweenService, Workspace } from "@rbxts/services";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";
import { createGUID } from "shared/utils/guid";

interface ShippingContainer extends Folder {
    ShippingContainerSpawner: Part & {
        Spawnpoint: Part;
        Device: Part & {
            Face: BasePart & {
                ProximityPrompt: ProximityPrompt;
            }
        }
    };
    Prox: Part & {
        ProximityPrompt: ProximityPrompt;
    };
    DoorHingeR: Part & {
        Part: Part
    };
    DoorHingeL: Part & {
        Part: Part
    };
}

@Component({ tag: TAGS.ShippingContainerComponent })
export class ShippingContainerComponent extends BaseComponent<{}, ShippingContainer> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    private SnowmobileMap = new Map<number, Instance | undefined>()

    onStart() {
        this.instance.Prox.ProximityPrompt.Triggered.Connect((player) => {
            const chem = player.Character?.FindFirstChild('ReactiveChemicalTool')
            if (chem && chem.IsA('Tool')) {
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Applied Reactive Chemical!',
                    textColor: new Color3(0.15, 0.86, 0.47),
                    textStrokeColor: new Color3(1, 1, 1)
                });
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Snowmobile spawner is activated!!',
                    textColor: new Color3(0.15, 0.86, 0.47),
                    textStrokeColor: new Color3(0, 0.25, 0.05)
                })
                this.PlayerExperienceService.giveDoubletappedExperience(player, 80, 60000, this.id);
                chem.Destroy();
            }
        });
        this.instance.ShippingContainerSpawner.Device.Face.ProximityPrompt.Triggered.Connect((player) => {
            const prevMobile = this.SnowmobileMap.get(player.UserId);
            if (prevMobile) {
                prevMobile.Destroy();
            }
            const newMobile = InsertService.LoadAsset(ASSET_IDS.Snowmobile).Clone().FindFirstChild('Snowmobile') as Model;
            if (!newMobile) return;
            newMobile.Parent = Workspace;
            newMobile.PivotTo(this.instance.ShippingContainerSpawner.Spawnpoint.CFrame);
            this.SnowmobileMap.set(player.UserId, newMobile);
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: `${player.Name} created new Snowmobile`,
            })
        })
        Players.PlayerRemoving.Connect((player) => {
            this.SnowmobileMap.delete(player.UserId);
        })
    }

}