import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { onLocalPlayerToolEquipped } from "client/utils/tools";

interface MineableChemical extends BasePart {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.MineableChemicalComponent })
export class MineableChemicalComponent extends BaseComponent<{}, MineableChemical> implements OnStart {


    onStart() {
        onLocalPlayerToolEquipped((node) => {
            return node.Name === 'PickaxeTool'
        }, () => {
            this.instance.ProximityPrompt.Enabled = true;
        }, () => {
            this.instance.ProximityPrompt.Enabled = false;
        })
    }

}