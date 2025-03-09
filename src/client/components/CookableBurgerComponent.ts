import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players } from "@rbxts/services";
import { Events } from "client/network";


interface CookableBurger extends BasePart {
    ProximityPrompt: ProximityPrompt;
    CanBeCollected: BoolValue;
    BurgerPlaced: BoolValue;
}

@Component({ tag: TAGS.CookableBurgerComponent })
export class CookableBurgerComponent extends BaseComponent<{}, CookableBurger> implements OnStart {

    private setProximityPromptEnabled(burgerHeld: boolean) {
        const canBeCollected = this.instance.CanBeCollected.Value === true;
        const burgerPlaced = this.instance.BurgerPlaced.Value === true
        this.instance.ProximityPrompt.Enabled = canBeCollected || burgerHeld && !burgerPlaced;
    }

    private isInstanceABurger(node: Instance): boolean {
        return node.IsA('Tool') && node.Name === 'CookableBurgerTool'
    }

    onStart() {
        this.instance.ProximityPrompt.Enabled = false

        let burgerHeld = false;

        Players.LocalPlayer.Character?.ChildAdded.Connect((node) => {
            if (this.isInstanceABurger(node)) { // if we equipped burger
                burgerHeld = true;
                this.setProximityPromptEnabled(burgerHeld);
            }
        })
        Players.LocalPlayer.Character?.ChildRemoved.Connect((node) => {
            if (this.isInstanceABurger(node)) { // if we unequipped burger
                burgerHeld = false;
                this.setProximityPromptEnabled(burgerHeld);
            }
        })
        this.instance.CanBeCollected.Changed.Connect(() => {
            this.setProximityPromptEnabled(burgerHeld);
        })
        this.instance.BurgerPlaced.Changed.Connect(() => {
            this.setProximityPromptEnabled(burgerHeld);
        })
    }



}