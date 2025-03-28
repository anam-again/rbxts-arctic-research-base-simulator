import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ANIMATION_URLS, ASSET_IDS, TAGS } from "shared/globals";
import { InsertService } from "@rbxts/services";
import { Make } from "@rbxts/altmake";
import { getObjectSubInstance } from "shared/utils/objects";

interface Clipboard extends Tool {
}

@Component({ tag: TAGS.ClipboardTool })
export class ClipboardTool extends BaseComponent<{}, Clipboard> implements OnStart {

    private createdClipboard: Accessory | undefined;
    private createdPen: Accessory | undefined;

    private isOwnedByPlayer(instance: Instance): boolean {
        return (instance.Parent && instance.Parent.IsA('Model') && instance.Parent.FindFirstChild('HumanoidRootPart')?.IsA('BasePart')) ?? false;
    }

    onStart() {
        const preloadedClipboard = InsertService.LoadAsset(ASSET_IDS.ClipboardAccessory).FindFirstChild('ClipboardAccessory');
        const preloadedPen = InsertService.LoadAsset(ASSET_IDS.PenAccessory).FindFirstChild('PenAccessory')
        if (!preloadedClipboard || !preloadedPen) {
            throw error('Clipboard/pen failed to load')
        }

        const animation = Make('Animation', {
            AnimationId: ANIMATION_URLS.TakingNotes,
            Name: 'TakingNotes',
        });
        this.instance.Activated.Connect(() => {
            const character = this.instance.Parent;
            if (!character) return;
            const animator = getObjectSubInstance(character, ['Humanoid', 'Animator'], 'Animator');
            const track = animator.LoadAnimation(animation);
            track.Play();
        });
        this.instance.AncestryChanged.Connect((child, parent) => {
            if (this.isOwnedByPlayer(child) && parent) {
                const humanoid = parent.FindFirstChild('Humanoid') as Humanoid;
                const leftHand = parent.FindFirstChild('LeftHand') as BasePart;
                const rightHand = parent.FindFirstChild('RightHand') as BasePart;
                if (!leftHand || !rightHand || !humanoid) return;
                const clipboard = preloadedClipboard.Clone() as Accessory;
                this.createdClipboard = clipboard;
                const pen = preloadedPen.Clone() as Accessory;
                this.createdPen = pen;
                if (!pen || !clipboard) return;
                humanoid.AddAccessory(clipboard);
                humanoid.AddAccessory(pen);
            } else {
                if (this.createdClipboard) {
                    this.createdClipboard.Destroy();
                }
                if (this.createdPen) {
                    this.createdPen.Destroy();
                }
            }
        })
    }

}