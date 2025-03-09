import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { InsertService } from "@rbxts/services";
import { createToolAndGiveAndEquip } from "server/utils/tools";

interface CookableBurger extends Model {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.BurgerPrepStationComponent })
export class BurgerPrepStationComponent extends BaseComponent<{}, CookableBurger> implements OnStart {

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            const burger = player.Character?.FindFirstChild('CookedBurgerTool')
            if (burger && burger.IsA('Tool')) {
                burger.Destroy();
                createToolAndGiveAndEquip(player, ASSET_IDS.PreppedBurgerTool2, 'PreppedBurgerTool2', 'PreppedBurgerComponent');
            }
        })
    }

}