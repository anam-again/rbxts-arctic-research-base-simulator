import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ANIMATION_URLS, TAGS } from "shared/globals";
import { Make } from "@rbxts/altmake";
import { getObjectSubInstance } from "shared/utils/objects";
import { DestroyOnDropExtension } from "server/extensions/DestroyOnDropExtension";
import { UntouchableOnDropExtension } from "server/extensions/UntouchableOnDropExtension";

interface CoffeeMug extends Tool {
    Handle: BasePart,
    Union: BasePart,
    Part: BasePart
}

@Component({ tag: TAGS.CoffeeMugTool })
export class CoffeeMugToolComponent extends BaseComponent<{}, CoffeeMug> implements OnStart {

    onStart() {

        new DestroyOnDropExtension(this.instance);
        new UntouchableOnDropExtension(this.instance);

        const animation = Make('Animation', {
            AnimationId: ANIMATION_URLS.DrinkCoffee2,
            Name: 'DrinkCoffee2',
        });
        this.instance.Activated.Connect(() => {
            const character = this.instance.Parent;
            if (!character) return;
            const animator = getObjectSubInstance(character, ['Humanoid', 'Animator'], 'Animator');
            const track = animator.LoadAnimation(animation);
            track.Play();
        });

    }

}