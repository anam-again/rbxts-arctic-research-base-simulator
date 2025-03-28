import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { InsertService } from "@rbxts/services";
import { onLocalPlayerToolEquipped } from "client/utils/tools";

interface SignalAligner extends Folder {
    Prox: BasePart & {
        Align1Prox: ProximityPrompt;
        Align2Prox: ProximityPrompt;
        TakeAlign1Prox: ProximityPrompt;
        TakeAlign2Prox: ProximityPrompt;
    },
    HasAlignmentModule1: BoolValue;
    HasAlignmentModule2: BoolValue;
}

@Component({ tag: TAGS.SignalAlignerComponent })
export class SignalAlignerComponent extends BaseComponent<{}, SignalAligner> implements OnStart {

    setProxPrompts(name?: string) {
        if (this.instance.HasAlignmentModule1.Value === true) {
            this.instance.Prox.Align1Prox.Enabled = false;
            this.instance.Prox.Align2Prox.Enabled = false;
            this.instance.Prox.TakeAlign1Prox.Enabled = true;
            this.instance.Prox.TakeAlign2Prox.Enabled = false;
        } else if (this.instance.HasAlignmentModule2.Value === true) {
            this.instance.Prox.Align1Prox.Enabled = false;
            this.instance.Prox.Align2Prox.Enabled = false;
            this.instance.Prox.TakeAlign1Prox.Enabled = false;
            this.instance.Prox.TakeAlign2Prox.Enabled = true;
        } else if (name === 'AlignmentModule1') {
            this.instance.Prox.Align1Prox.Enabled = true;
            this.instance.Prox.Align2Prox.Enabled = false;
            this.instance.Prox.TakeAlign1Prox.Enabled = false;
            this.instance.Prox.TakeAlign2Prox.Enabled = false;
        } else if (name === 'AlignmentModule2Tool') {
            this.instance.Prox.Align1Prox.Enabled = false;
            this.instance.Prox.Align2Prox.Enabled = true;
            this.instance.Prox.TakeAlign1Prox.Enabled = false;
            this.instance.Prox.TakeAlign2Prox.Enabled = false;
        } else {
            this.instance.Prox.Align1Prox.Enabled = false;
            this.instance.Prox.Align2Prox.Enabled = false;
            this.instance.Prox.TakeAlign1Prox.Enabled = false;
            this.instance.Prox.TakeAlign2Prox.Enabled = false;
        }
    }

    onStart() {
        this.setProxPrompts();
        onLocalPlayerToolEquipped(() => {
            return true
        }, (node) => {
            this.setProxPrompts(node.Name);
        }, () => {
            this.setProxPrompts();
        });
        this.instance.HasAlignmentModule1.GetPropertyChangedSignal('Value').Connect(() => {
            this.setProxPrompts()
        });
        this.instance.HasAlignmentModule2.GetPropertyChangedSignal('Value').Connect(() => {
            this.setProxPrompts()
        });
    }

}