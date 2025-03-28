import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";
import { createGUID } from "shared/utils/guid";


interface ActivatableAlignmentModule1Giver extends Model {
    Base: Part & {
        ProximityPrompt: ProximityPrompt;
    }
}

@Component({ tag: TAGS.ActivatableAlignmentModule1Giver })
export class ActivatableAlignmentModule1GiverComponent extends BaseComponent<{}, ActivatableAlignmentModule1Giver> implements OnStart {
    private id = createGUID();

    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    onStart() {
        this.instance.Base.ProximityPrompt.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Acquired Blue Alignment Tool'
            })
            this.PlayerExperienceService.giveDoubletappedExperience(player, 35, 60000, this.id);
            createToolAndGiveAndEquip(player, ASSET_IDS.AlignmentModule1Tool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent']);
        })
    }

}