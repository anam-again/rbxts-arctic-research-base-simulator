import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ANIMATION_URLS, ASSET_IDS, TAGS } from "shared/globals";
import { InsertService } from "@rbxts/services";
import { Make } from "@rbxts/altmake";
import { getObjectSubInstance } from "shared/utils/objects";

interface IDBadge extends Tool {
}

@Component({ tag: TAGS.IDBadgeTool })
export class IDBadgeTool extends BaseComponent<{}, IDBadge> implements OnStart {

    private createdBadge: Accessory | undefined;

    private isOwnedByPlayer(instance: Instance): boolean {
        return (instance.Parent && instance.Parent.IsA('Model') && instance.Parent.FindFirstChild('HumanoidRootPart')?.IsA('BasePart')) ?? false;
    }

    onStart() {
        const preloadedBadge = InsertService.LoadAsset(ASSET_IDS.BadgeAccessory).FindFirstChild('IDBadge');
        if (!preloadedBadge) {
            throw error('Badge failed to load')
        }

        const animation = Make('Animation', {
            AnimationId: ANIMATION_URLS.ShowBadge,
            Name: 'ShowBadge',
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
                const rightHand = parent.FindFirstChild('RightHand') as BasePart;
                if (!rightHand || !humanoid) return;
                const badge = preloadedBadge.Clone() as Accessory;
                if (!badge) return;
                this.createdBadge = badge;
                humanoid.AddAccessory(badge);
            } else {
                if (this.createdBadge) {
                    this.createdBadge.Destroy();
                }
            }
        })
    }

}