import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";
import { TAGS } from "shared/globals";
import { DestroyOnDropExtension } from "server/extensions/DestroyOnDropExtension";

@Component({ tag: TAGS.DestroyOnDropComponent })
export class DestroyOnDropComponent extends BaseComponent implements OnStart {
    onStart(): void {
        new DestroyOnDropExtension(this.instance)
    }
}