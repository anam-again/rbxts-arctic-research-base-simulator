import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { DEVELOPER_PRODUCTS, TAGS } from "shared/globals";
import { MarketplaceService } from "@rbxts/services";


interface Donation2000 extends Part {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.Donation2000Component })
export class Donation2000Component extends BaseComponent<{}, Donation2000> implements OnStart {

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            MarketplaceService.PromptProductPurchase(player, DEVELOPER_PRODUCTS.Donation2000);
        })
    }

}