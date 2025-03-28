import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { TweenService } from "@rbxts/services";
import { onLocalPlayerToolEquipped } from "client/utils/tools";

interface ShippingContainer extends Folder {
    ShippingContainerSpawner: Part & {
        Spawnpoint: Part;
        Device: Part & {
            Face: BasePart & {
                ProximityPrompt: ProximityPrompt;
                Decal: Decal;
            }
        }
    };
    Prox: Part & {
        ProximityPrompt: ProximityPrompt;
    };
    DoorHingeR: Part & {
        Part: Part
    };
    DoorHingeL: Part & {
        Part: Part
    };
}

@Component({ tag: TAGS.ShippingContainerComponent })
export class ShippingContainerComponent extends BaseComponent<{}, ShippingContainer> implements OnStart {

    onStart() {
        this.instance.Prox.ProximityPrompt.Enabled = false;
        let actionCompleted = false;
        onLocalPlayerToolEquipped((node) => {
            return !actionCompleted && node.Name === 'ReactiveChemicalTool'
        }, () => {
            this.instance.Prox.ProximityPrompt.Enabled = true;
        }, () => {
            this.instance.Prox.ProximityPrompt.Enabled = false;
        })
        const tweenInfo = new TweenInfo(1);
        this.instance.Prox.ProximityPrompt.Triggered.Connect((player) => {
            const chem = player.Character?.FindFirstChild('ReactiveChemicalTool')
            if (chem && chem.IsA('Tool')) {
                actionCompleted = true;
                this.instance.Prox.ProximityPrompt.Enabled = false;
                chem.Destroy();
                TweenService.Create(this.instance.DoorHingeL.Part, tweenInfo, { Orientation: new Vector3(0, -12.189, 0), Position: new Vector3(87.177, 74.181, 179.499) }).Play();
                TweenService.Create(this.instance.DoorHingeR.Part, tweenInfo, { Orientation: new Vector3(0, 157.189, 0), Position: new Vector3(66.535, 74.181, 179.313) }).Play();
                const icycle = this.instance.FindFirstChild('icycles2');
                if (icycle) icycle.Destroy();
                this.instance.ShippingContainerSpawner.Device.Face.ProximityPrompt.Enabled = true;
                this.instance.ShippingContainerSpawner.Device.Face.Decal.Color3 = new Color3(0.02, 0.95, 0.02)
            }
        })
    }

}