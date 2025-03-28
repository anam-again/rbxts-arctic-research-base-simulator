import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { createToolAndGiveAndEquip } from "server/utils/tools";
import { GuiAdornmentService } from "../services/GuiAdornmentService";

interface CookableBurger extends BasePart {
    ProximityPrompt: ProximityPrompt;
    CanBeCollected: BoolValue;
    BurgerPlaced: BoolValue;
}

@Component({ tag: TAGS.CookableBurgerComponent })
export class CookableBurgerComponent extends BaseComponent<{}, CookableBurger> implements OnStart {
    constructor(private GuiAdornmentSerice: GuiAdornmentService) {
        super();
    }

    onStart() {
        this.instance.Transparency = 1;
        this.instance.CanBeCollected.Value = false;
        this.instance.BurgerPlaced.Value = false;

        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            if (this.instance.BurgerPlaced.Value === false) {
                const burger = player.Character?.FindFirstChild('CookableBurgerTool')
                if (burger && burger.IsA('Tool')) {
                    this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                        richText: 'Placed Burger Patty',
                    })
                    burger.Destroy();
                    this.instance.BurgerPlaced.Value = true;
                    this.instance.Transparency = 0;
                    this.instance.Color = new Color3(1, 0, 0)
                    task.wait(5);
                    this.instance.Color = new Color3(0.56, 0.22, 0.02)
                    this.instance.CanBeCollected.Value = true;
                }
            } else if (this.instance.CanBeCollected.Value === true) {
                this.GuiAdornmentSerice.asyncCreateAdornmentText(player, {
                    richText: 'Acquired Cooked Burger',
                })
                createToolAndGiveAndEquip(player, ASSET_IDS.CookedBurgerTool, ['DestroyOnDropComponent', 'UntouchableOnDropComponent'])
                this.instance.Transparency = 1;
                this.instance.CanBeCollected.Value = false;
                this.instance.BurgerPlaced.Value = false;
            }
        })
    }

}