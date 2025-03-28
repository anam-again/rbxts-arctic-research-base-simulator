import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { onLocalPlayerToolEquipped } from "client/utils/tools";

interface VoidIDCardDoor extends Model {
    Handle: Part;
}

@Component({ tag: TAGS.VoidIDCardDoorComponent })
export class VoidIDCardDoorComponent extends BaseComponent<{}, VoidIDCardDoor> implements OnStart {


    onStart() {
        onLocalPlayerToolEquipped((node) => {
            return node.Name === 'VoidIDCardTool'
        }, () => {
            this.instance.Handle.CanCollide = false;
        }, () => {
            this.instance.Handle.CanCollide = true;
        })
    }

}