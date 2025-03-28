import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";


interface KillOnTouch extends BasePart {

}

@Component({ tag: TAGS.KillOnTouchComponent })
export class KillOnTouchComponent extends BaseComponent<{}, KillOnTouch> implements OnStart {
    onStart() {
        this.instance.Touched.Connect((part) => {
            const humanoid = part.Parent?.FindFirstChild('Humanoid') as Humanoid;
            if (humanoid) {
                humanoid.TakeDamage(100);
            }
        })
    }

}