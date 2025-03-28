import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";


interface ActivatablePickaxeBox extends Model {
    Base: Part & {
        ProximityPrompt: ProximityPrompt;
    }
}

@Component({ tag: TAGS.ActivatablePickaxeBoxComponent })
export class ActivatablePickaxeBoxComponent extends BaseComponent<{}, ActivatablePickaxeBox> implements OnStart {
    private id = createGUID();
    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }
    onStart() {
        this.instance.Base.ProximityPrompt.Triggered.Connect((player) => {
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Acquired Pickaxe',
            })
            this.PlayerExperienceService.giveDoubletappedExperience(player, 10, 60000, this.id);
            createToolAndGiveAndEquip(player, ASSET_IDS.PickaxeTool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent']);
        })
    }

}