import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";
import { createGUID } from "shared/utils/guid";


interface ActivatableAlignmentModule2Giver extends Model {
    Base: Part & {
        ProximityPrompt: ProximityPrompt;
    }
}

@Component({ tag: TAGS.ActivatableAlignmentModule2GiverComponent })
export class ActivatableAlignmentModule2GiverComponent extends BaseComponent<{}, ActivatableAlignmentModule2Giver> implements OnStart {
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    private id = createGUID();

    onStart() {
        this.instance.Base.ProximityPrompt.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Acquired Purple Alignment Tool',
                textColor: new Color3(.1, .1, .5),
                textStrokeColor: new Color3(1, 1, 1)
            })
            this.PlayerExperienceService.giveDoubletappedExperience(player, 120, 60000, this.id);
            createToolAndGiveAndEquip(player, ASSET_IDS.AlignmentModule2Tool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent']);
        })
    }

}