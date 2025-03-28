import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";


interface SnowmobileRearBoxGiver extends Model {
    Base: Part & {
        ProximityPrompt: ProximityPrompt;
    }
}

@Component({ tag: TAGS.SnowmobileRearBoxGiverComponent })
export class SnowmobileRearBoxGiverComponent extends BaseComponent<{}, SnowmobileRearBoxGiver> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    onStart() {
        this.instance.Base.ProximityPrompt.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Acquired Snowmobile Rear Box!',
            })
            this.PlayerExperienceService.giveDoubletappedExperience(player, 25, 60000, this.id);
            createToolAndGiveAndEquip(player, ASSET_IDS.SnowmobileRearBoxTool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent']);
        })
    }

}