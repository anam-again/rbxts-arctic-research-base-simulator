import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { onLocalCharacterAdded } from "client/utils/tasks";


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

        let childAdded: RBXScriptConnection | void = undefined;
        let childRemoved: RBXScriptConnection | undefined | void = undefined;
        onLocalCharacterAdded((character) => {
            childAdded = character.ChildAdded.Connect((node) => {
                if (this.isInstanceABurger(node)) { // if we equipped burger
                    burgerHeld = true;
                    this.setProximityPromptEnabled(burgerHeld);
                }
            })
            childRemoved = character.ChildRemoved.Connect((node) => {
                if (this.isInstanceABurger(node)) { // if we unequipped burger
                    burgerHeld = false;
                    this.setProximityPromptEnabled(burgerHeld);
                }
            })
        }).Connect(() => {
            if (childAdded) childAdded = childAdded.Disconnect();
            if (childRemoved) childRemoved = childRemoved.Disconnect();
        })



        this.instance.CanBeCollected.Changed.Connect(() => {
            this.setProximityPromptEnabled(burgerHeld);
        })
        this.instance.BurgerPlaced.Changed.Connect(() => {
            this.setProximityPromptEnabled(burgerHeld);
        })
    }



}