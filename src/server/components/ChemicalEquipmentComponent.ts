import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";

interface ChemicalEquipment extends Model {
    Base: Part & {
        ChemAProximityPrompt: ProximityPrompt,
        ChemBProximityPrompt: ProximityPrompt,
        ReactiveCompoundProximityPrompt: ProximityPrompt,
        ParticleEmitter: ParticleEmitter,
    };
    Chem1: Part;
    Chem2: Part;
    ChemRunning: UnionOperation;
    ChemAInserted: BoolValue;
    ChemBInserted: BoolValue;
    ReactiveCompoundReady: BoolValue;
}

@Component({ tag: TAGS.ChemicalEquipmentComponent })
export class ChemicalEquipmentComponent extends BaseComponent<{}, ChemicalEquipment> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }
    onStart() {
        this.instance.Base.ParticleEmitter.Enabled = false;
        this.instance.Chem1.Transparency = 1;
        this.instance.Chem2.Transparency = 1;
        this.instance.ChemRunning.Transparency = 1;
        this.instance.Base.ChemAProximityPrompt.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Inserted Red Chemical',
                textColor: new Color3(0.6, 0.12, 0.08),
                textStrokeColor: new Color3(1, 1, 1)
            })
            this.PlayerExperienceService.giveDoubletappedExperience(player, 40, 60000, this.id);
            const chemA = player.Character?.FindFirstChild('MineableChemicalTool');
            if (chemA && chemA.IsA('Tool') && this.instance.ChemAInserted.Value === false) {
                chemA.Destroy();
                this.instance.ChemAInserted.Value = true;
                this.instance.Chem1.Transparency = 0;
                if (this.instance.ChemBInserted.Value === true) {
                    this.runChemicals(player);
                } else {
                    this.instance.Chem1.Color = new Color3(1, 0, 0)
                }
            }

        });
        this.instance.Base.ChemBProximityPrompt.Triggered.Connect((player) => {
            const chemB = player.Character?.FindFirstChild('ChemicalBTool');
            if (chemB && chemB.IsA('Tool') && this.instance.ChemBInserted.Value === false) {
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Inserted Blue Chemical',
                    textColor: new Color3(0.08, 0.31, 0.6),
                    textStrokeColor: new Color3(1, 1, 1)
                })
                this.PlayerExperienceService.giveDoubletappedExperience(player, 60, 60000, this.id);
                chemB.Destroy();
                this.instance.ChemBInserted.Value = true;
                this.instance.Chem1.Transparency = 0;
                if (this.instance.ChemAInserted.Value === true) {
                    this.runChemicals(player);
                } else {
                    this.instance.Chem1.Color = new Color3(0, 0, 1)
                }
            }
        })
        this.instance.Base.ReactiveCompoundProximityPrompt.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Acquired Reactive Compound!!',
                textColor: new Color3(0.05, 0.68, 0.93),
                textStrokeColor: new Color3(1, 1, 1)
            })
            this.PlayerExperienceService.giveDoubletappedExperience(player, 120, 60000, this.id);
            createToolAndGiveAndEquip(player, ASSET_IDS.ReactiveChemicalTool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent']);
            this.instance.ReactiveCompoundReady.Value = false;
            this.instance.ChemAInserted.Value = false;
            this.instance.ChemBInserted.Value = false;
            this.instance.Chem2.Transparency = 1;
        })
    }

    private runChemicals(player: Player) {
        this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
            richText: 'Something is happening!',
            textColor: new Color3(0.76, 0.07, 0.61),
            textStrokeColor: new Color3(1, 1, 1)
        })
        this.instance.Base.ParticleEmitter.Enabled = true;
        this.instance.Chem1.Color = new Color3(1, 0, 1);
        task.wait(3);
        this.instance.ChemRunning.Transparency = 0;
        task.wait(3);
        this.instance.ChemRunning.Transparency = 1;
        this.instance.Chem1.Transparency = 1;
        this.instance.Chem2.Transparency = 0;
        this.instance.Base.ParticleEmitter.Enabled = false;
        this.instance.ReactiveCompoundReady.Value = true;
    }

}