import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";
import { TAGS } from "shared/globals";
import { UntouchableOnDropExtension } from "server/extensions/UntouchableOnDropExtension";

@Component({ tag: TAGS.UntouchableOnDropComponent })
export class UntouchableOnDropComponent extends BaseComponent implements OnStart {
    onStart(): void {
        new UntouchableOnDropExtension(this.instance)
    }
}