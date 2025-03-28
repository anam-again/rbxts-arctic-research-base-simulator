import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";
import { Debris, InsertService, TweenService, Workspace } from "@rbxts/services";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { Make } from "@rbxts/altmake";
import { tweenModelPivot } from "server/utils/models";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";

interface SignalAligner extends Folder {
    Prox: BasePart & {
        Align1Prox: ProximityPrompt;
        Align2Prox: ProximityPrompt;
        TakeAlign1Prox: ProximityPrompt;
        TakeAlign2Prox: ProximityPrompt;
    },
    HasAlignmentModule1: BoolValue;
    HasAlignmentModule2: BoolValue;
    Dish: Model & {
        Point: BasePart;
        Dish: BasePart;
    };
}

type alignerOptions = 'Align1' | 'Align2'

@Component({ tag: TAGS.SignalAlignerComponent })
export class SignalAlignerComponent extends BaseComponent<{}, SignalAligner> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    private alignmentCFrame!: CFrame;
    private particleScript: thread | undefined;

    addAlignmentModuleModel(alignerModel: alignerOptions) {
        let alignmentModule;
        switch (alignerModel) {
            case 'Align1':
                alignmentModule = InsertService.LoadAsset(ASSET_IDS.AlignmentModule1Base).Clone().FindFirstChildOfClass('Model') as Model;
                break;
            case "Align2":
                alignmentModule = InsertService.LoadAsset(ASSET_IDS.AlignmentModule2Model).Clone().FindFirstChildOfClass('Model') as Model;
                break;
        }
        if (!alignmentModule) throw error('Could not load alignment module asset');
        alignmentModule.Name = 'InsertedAlignmentModule';
        alignmentModule.Parent = this.instance;
        alignmentModule.PivotTo(this.alignmentCFrame);
    }
    destroyAlignmentModuleModel() {
        const model = this.instance.FindFirstChild('InsertedAlignmentModule');
        if (model) {
            model.Destroy();
        }
    }
    startParticles(aligner: alignerOptions) {
        let pos: Vector3;
        switch (aligner) {
            case 'Align1':
                pos = new Vector3(-773.916, 115.746, -442.75)
                break;
            case 'Align2':
                pos = new Vector3(-868.544, 66.847, 52.526)
                break;
        }
        this.stopParticles();
        this.particleScript = task.spawn(() => {
            const tweenInfo = new TweenInfo(20, Enum.EasingStyle.Linear);
            while (true) {
                const particle = Make('Part', {
                    Parent: Workspace,
                    Size: new Vector3(1, 1, 1),
                    Material: Enum.Material.Neon,
                    Color: new Color3(1, 0, 0),
                    Position: this.instance.Dish.Point.Position,
                    CanCollide: false,
                    CanTouch: false,
                    CanQuery: false,
                    Anchored: true,
                    CastShadow: false,
                });
                TweenService.Create(particle, tweenInfo, { Position: pos }).Play();
                task.wait(1);
                Debris.AddItem(particle, 20);
            }
        })
    }
    stopParticles() {
        if (this.particleScript) {
            task.cancel(this.particleScript);
        }
    }

    onStart() {
        const al = this.instance.FindFirstChild('AlignmentModuleBase') as Model;
        if (!al || !al.PrimaryPart) throw error('No alignment module base');
        this.alignmentCFrame = al.PrimaryPart.CFrame;
        al.Destroy();

        const tweenInfo = new TweenInfo(2);

        this.instance.Prox.Align1Prox.Triggered.Connect((player) => {
            const playerAlignmentModule = player.Character?.FindFirstChild('AlignmentModule1');
            if (playerAlignmentModule) {
                playerAlignmentModule.Destroy();
                this.PlayerExperienceService.giveDoubletappedExperience(player, 30, 60000, this.id);
                this.instance.HasAlignmentModule1.Value = true;
                this.addAlignmentModuleModel('Align1');
                if (!this.instance.Dish) return;
                const pivot = CFrame.lookAt(this.instance.Dish.GetPivot().Position, new Vector3(-773.916, 115.746, -442.75));
                tweenModelPivot(this.instance.Dish, 4, pivot);
                this.startParticles('Align1');
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Inserted alignment module...',
                })
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'The radar is moving!...',
                    textColor: new Color3(0.8, 0.88, 0.02),
                    textStrokeColor: new Color3(1, 1, 1)
                })
            }
        })
        this.instance.Prox.Align2Prox.Triggered.Connect((player) => {
            const playerAlignmentModule = player.Character?.FindFirstChild('AlignmentModule2Tool');
            if (playerAlignmentModule) {
                this.PlayerExperienceService.giveDoubletappedExperience(player, 35, 60000, this.id);
                playerAlignmentModule.Destroy();
                this.instance.HasAlignmentModule2.Value = true;
                this.addAlignmentModuleModel('Align2');
                if (!this.instance.Dish) return;
                const pivot = CFrame.lookAt(this.instance.Dish.GetPivot().Position, new Vector3(-868.544, 66.847, 52.526));
                tweenModelPivot(this.instance.Dish, 4, pivot);
                this.startParticles('Align2');
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Inserted alignment module...',
                })
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'The radar is moving!...',
                    textColor: new Color3(0.88, 0.02, 0.88),
                    textStrokeColor: new Color3(1, 1, 1)
                })
            }
        })
        this.instance.Prox.TakeAlign1Prox.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Took blue alignment module',
            })
            createToolAndGiveAndEquip(player, ASSET_IDS.AlignmentModule1Tool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent'])
            this.instance.HasAlignmentModule1.Value = false;
            this.destroyAlignmentModuleModel();
            this.stopParticles();
        })
        this.instance.Prox.TakeAlign2Prox.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Took purple alignment module',
            })
            createToolAndGiveAndEquip(player, ASSET_IDS.AlignmentModule2Tool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent'])
            this.instance.HasAlignmentModule2.Value = false;
            this.destroyAlignmentModuleModel();
            this.stopParticles();
        })
    }

}