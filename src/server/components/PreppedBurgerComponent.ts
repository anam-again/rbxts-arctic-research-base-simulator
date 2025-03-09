import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ANIMATION_URLS, TAGS } from "shared/globals";
import { DestroyOnDropExtension } from "server/extensions/DestroyOnDropExtension";
import { UntouchableOnDropExtension } from "server/extensions/UntouchableOnDropExtension";
import { Make } from "@rbxts/altmake";
import { getObjectSubInstance } from "shared/utils/objects";

interface PreppedBurger extends Tool {

}

@Component({ tag: TAGS.PreppedBurgerComponent })
export class PreppedBurgerComponent extends BaseComponent<{}, PreppedBurger> implements OnStart {


    onStart() {
        new DestroyOnDropExtension(this.instance);
        new UntouchableOnDropExtension(this.instance);

        const animation = Make('Animation', {
            AnimationId: ANIMATION_URLS.EatingFood,
            Name: 'EatingFood',
        });
        this.instance.Activated.Connect(() => {
            const character = this.instance.Parent;
            if (!character) return;
            const animator = getObjectSubInstance(character, ['Humanoid', 'Animator'], 'Animator');
            const track = animator.LoadAnimation(animation);
            track.Play();
            task.wait(.87);
            this.instance.Destroy();
        });
    }

}