import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { InsertService, Players } from "@rbxts/services";
import { createToolAndGiveAndEquip } from "server/utils/tools";


interface BurgerBox extends Model {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.ActivatableBurgerBoxComponent })
export class ActivatableBurgerBoxComponent extends BaseComponent<{}, BurgerBox> implements OnStart {

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            createToolAndGiveAndEquip(player, ASSET_IDS.CookableBurgerTool, 'CookableBurgerTool', 'DestroyOnDropComponent')
        })
    }

}