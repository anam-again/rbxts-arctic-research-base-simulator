import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { DEVELOPER_PRODUCTS, TAGS } from "shared/globals";
import { MarketplaceService, Players, TweenService } from "@rbxts/services";
import { GuiAdornmentService } from "../services/GuiAdornmentService";


interface Donation100 extends Part {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.Donation100Component })
export class Donation100Component extends BaseComponent<{}, Donation100> implements OnStart {

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            MarketplaceService.PromptProductPurchase(player, DEVELOPER_PRODUCTS.Donation100);
        })
    }

}