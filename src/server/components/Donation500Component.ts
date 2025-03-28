import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { DEVELOPER_PRODUCTS, TAGS } from "shared/globals";
import { MarketplaceService } from "@rbxts/services";


interface Donation500 extends Part {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.Donation500Component })
export class Donation500Component extends BaseComponent<{}, Donation500> implements OnStart {

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            MarketplaceService.PromptProductPurchase(player, DEVELOPER_PRODUCTS.Donation500);
        })
    }

}