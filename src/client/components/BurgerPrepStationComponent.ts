import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players } from "@rbxts/services";
import { onCharacterAdded } from "shared/utils/tasks";

interface BurgerPrepStation extends Model {
    ProximityPrompt: ProximityPrompt
}

@Component({ tag: TAGS.BurgerPrepStationComponent })
export class BurgerPrepStationComponent extends BaseComponent<{}, BurgerPrepStation> implements OnStart {

    private isInstanceACookedBurger(node: Instance): boolean {
        return node.IsA('Tool') && node.Name === 'CookedBurgerTool'
    }

    onStart() {
        this.instance.ProximityPrompt.Enabled = false;
        onCharacterAdded(Players.LocalPlayer, () => {
            this.initHooks()
        })
    }

    private initHooks() {
        Players.LocalPlayer.Character?.ChildAdded.Connect((node) => {
            if (this.isInstanceACookedBurger(node)) { // if we equipped burger
                this.instance.ProximityPrompt.Enabled = true;
            }
        })
        Players.LocalPlayer.Character?.ChildRemoved.Connect((node) => {
            if (this.isInstanceACookedBurger(node)) { // if we unequipped burger
                this.instance.ProximityPrompt.Enabled = false;
            }
        })
    }



}