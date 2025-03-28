import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { onLocalPlayerToolEquipped } from "client/utils/tools";
import { Players } from "@rbxts/services";

interface ChemicalEquipment extends Model {
    Base: Part & {
        ChemAProximityPrompt: ProximityPrompt,
        ChemBProximityPrompt: ProximityPrompt,
        ReactiveCompoundProximityPrompt: ProximityPrompt,
        ParticleEmitter: ParticleEmitter,
    };
    Chem1: Part;
    Chem2: Part;
    ChemRunning: UnionOperation;
    ChemAInserted: BoolValue;
    ChemBInserted: BoolValue;
    ReactiveCompoundReady: BoolValue;
}

@Component({ tag: TAGS.ChemicalEquipmentComponent })
export class MineableChemicalBComponent extends BaseComponent<{}, ChemicalEquipment> implements OnStart {


    private setChemicalsCanBeInserted() {
        if (this.instance.ReactiveCompoundReady.Value === true) {
            this.instance.Base.ReactiveCompoundProximityPrompt.Enabled = true;
            this.instance.Base.ChemAProximityPrompt.Enabled = false;
            this.instance.Base.ChemBProximityPrompt.Enabled = false;
        } else if (Players.LocalPlayer.Character?.FindFirstChild('MineableChemicalTool') && !this.instance.ChemAInserted.Value === true) {
            this.instance.Base.ReactiveCompoundProximityPrompt.Enabled = false;
            this.instance.Base.ChemAProximityPrompt.Enabled = true;
            this.instance.Base.ChemBProximityPrompt.Enabled = false;
        } else if (Players.LocalPlayer.Character?.FindFirstChild('ChemicalBTool') && !this.instance.ChemBInserted.Value === true) {
            this.instance.Base.ReactiveCompoundProximityPrompt.Enabled = false;
            this.instance.Base.ChemAProximityPrompt.Enabled = false;
            this.instance.Base.ChemBProximityPrompt.Enabled = true;
        } else {
            this.instance.Base.ReactiveCompoundProximityPrompt.Enabled = false;
            this.instance.Base.ChemAProximityPrompt.Enabled = false;
            this.instance.Base.ChemBProximityPrompt.Enabled = false;
        }
    }

    onStart() {
        this.setChemicalsCanBeInserted();
        onLocalPlayerToolEquipped(() => {
            return true
        }, () => {
            this.setChemicalsCanBeInserted();
        }, () => {
            this.setChemicalsCanBeInserted();
        });
        this.instance.ChemAInserted.GetPropertyChangedSignal('Value').Connect(() => {
            this.setChemicalsCanBeInserted();
        })
        this.instance.ChemBInserted.GetPropertyChangedSignal('Value').Connect(() => {
            this.setChemicalsCanBeInserted();
        })
        this.instance.ReactiveCompoundReady.GetPropertyChangedSignal('Value').Connect(() => {
            this.setChemicalsCanBeInserted();
        })
    }

}