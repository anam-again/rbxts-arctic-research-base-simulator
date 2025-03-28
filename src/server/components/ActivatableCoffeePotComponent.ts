import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { Events } from "server/network";
import { GuiAdornmentService } from "../services/GuiAdornmentService";
import { createGUID } from "shared/utils/guid";
import { PlayerExperienceService } from "server/services/PlayerExperienceService";


interface ActivatableCoffeePot extends Model {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.ActivatableCoffeePotComponent })
export class ActivatableCoffeePotComponent extends BaseComponent<{}, ActivatableCoffeePot> implements OnStart {
    private id = createGUID();

    constructor(private GuiAdornmentSerice: GuiAdornmentService, private PlayerExperienceService: PlayerExperienceService) {
        super();
    }

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            createToolAndGiveAndEquip(player, ASSET_IDS.CoffeeMugTool, ['CoffeeMugTool', 'UntouchableOnDropComponent']);
            this.PlayerExperienceService.giveDoubletappedExperience(player, 5, 10000, this.id);
            this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                richText: 'Acquired Coffee'
            })
        })
    }
}