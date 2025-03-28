import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";

interface MineableChemicalB extends BasePart {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.MineableChemicalBComponent })
export class MineableChemicalBComponent extends BaseComponent<{}, MineableChemicalB> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            const pick = player.Character?.FindFirstChild('PickaxeTool')
            if (pick && pick.IsA('Tool')) {
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Acquired Blue Chemical!',
                    textColor: new Color3(0.42, 0.42, 0.81),
                    textStrokeColor: new Color3(1, 1, 1)
                })
                this.PlayerExperienceService.giveDoubletappedExperience(player, 85, 60000, this.id);
                createToolAndGiveAndEquip(player, ASSET_IDS.ChemicalBTool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent']);
            }
        })
    }

}