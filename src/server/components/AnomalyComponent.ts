import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { Players, TweenService } from "@rbxts/services";
import { Events } from "server/network";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { DoubletapService } from "server/services/DoubletapService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";


interface Anomaly extends Part {
    Prompt: Part & {
        ProximityPrompt: ProximityPrompt;
    },
    GreenButton: Part,
    InsertAnomalyPrompt: ProximityPrompt;
    InsertedAnomaly: BoolValue;
    PointLight: PointLight;
    TeleportTo: Part;
    TeleportReturn: Part;
    VoidIDCardModel: Model & {
        Handle: Part & {
            ProximityPrompt: ProximityPrompt;
        }
    }
}

@Component({ tag: TAGS.AnomalyComponent })
export class AnomalyComponent extends BaseComponent<{}, Anomaly> implements OnStart {
    private id = createGUID();

    constructor(private GuiAdornmentSerice: GuiAdornmentService, private DoubletapService: DoubletapService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    private activateAnomaly() {
        if (this.instance.InsertedAnomaly.Value === false) return;
        this.instance.PointLight.Enabled = true;
        this.instance.PointLight.Range = 0;
        this.instance.Color = new Color3(0, 0, 0);
        TweenService.Create(this.instance.PointLight, new TweenInfo(2), { Range: 50 }).Play();
        TweenService.Create(this.instance, new TweenInfo(2), { Color: new Color3(1, 1, 1) }).Play();
        let touchedOnce = false;
        const touched = this.instance.Touched.Connect((part) => {
            const player = Players.GetPlayerFromCharacter(part.Parent);
            if (player && this.DoubletapService.isDoubletapped(`${player.UserId}:${this.id}`)) {
                if (!touchedOnce) {
                    touchedOnce = true;
                    task.spawn(() => {
                        task.wait(4);
                        task.spawn(() => {
                            this.deactivateAnomaly();
                        })
                        touched.Disconnect();
                    })
                }
                player.Character?.PivotTo(this.instance.TeleportTo.CFrame);
                Events.setVoidLighting(player);
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: "Teleported somewhere!",
                    textColor: new Color3(1, 1, 1),
                    textStrokeColor: new Color3(1, 1, 1)
                })
            }
        })
    }

    private returnTeleport(player: Player) {
        createToolAndGiveAndEquip(player, ASSET_IDS.VoidIDCardTool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent'])
        player.Character?.PivotTo(this.instance.TeleportReturn.CFrame);
        Events.setRegularLighting(player);
        this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
            richText: "Teleported back to the base...",
        });
        this.PlayerExperienceService.giveDoubletappedExperience(player, 500, 60000, this.id);
    }

    private deactivateAnomaly() {
        TweenService.Create(this.instance.PointLight, new TweenInfo(2), { Range: 0 }).Play();
        TweenService.Create(this.instance, new TweenInfo(2), { Color: new Color3(0, 0, 0) }).Play();
        this.instance.InsertedAnomaly.Value = false;
        this.instance.PointLight.Enabled = false;
    }

    onStart() {
        const t1 = TweenService.Create(this.instance,
            new TweenInfo(1), {
            Color: new Color3(1, 1, 1)
        });
        const t2 = TweenService.Create(this.instance,
            new TweenInfo(1), {
            Color: new Color3(0, 0, 0)
        });
        this.instance.Prompt.ProximityPrompt.Triggered.Connect((player) => {
            if (this.instance.InsertedAnomaly.Value === true) return;
            if (t1.PlaybackState.Name === 'Playing' || t2.PlaybackState.Name === 'Playing') return;
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: "The anomoly is flickering...",
            })
            t1.Play();
            this.instance.Prompt.ProximityPrompt.Enabled = false;
            this.instance.GreenButton.Color = new Color3(0, 1, 0)
            t1.Completed.Once(() => {
                t2.Play();
                t2.Completed.Once(() => {
                    this.instance.GreenButton.Color = new Color3(.2, .4, 1)
                    this.instance.Prompt.ProximityPrompt.Enabled = true;
                })
            })
        });
        this.instance.InsertAnomalyPrompt.Triggered.Connect((player) => {
            const snowmobile = player.Character?.FindFirstChildOfClass('Humanoid')?.SeatPart?.Parent as Model;
            if (!snowmobile || snowmobile.Name !== 'Snowmobile') return;
            const hasAnomaly = snowmobile.FindFirstChild('HasAnomaly') as BoolValue;
            if (!hasAnomaly) return;
            if (hasAnomaly.Value === true) {
                const event = snowmobile.FindFirstChild('DeactivateAnomaly') as BindableEvent;
                if (event) {
                    event.Fire();
                    this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                        richText: "Inserted the anomaly into the larger one...",
                    })
                    this.instance.InsertedAnomaly.Value = true;
                    this.activateAnomaly();
                }
            }
        })
        this.instance.VoidIDCardModel.Handle.ProximityPrompt.Triggered.Connect((player) => {
            this.returnTeleport(player);
        })

        const voidcard = this.instance.VoidIDCardModel.PrimaryPart;
        if (!voidcard) return;
        TweenService.Create(voidcard, new TweenInfo(10, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, math.huge), { CFrame: voidcard.CFrame.mul(CFrame.Angles(360, 0, 0)) }).Play();
    }

}