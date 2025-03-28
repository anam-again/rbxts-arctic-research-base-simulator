import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players, TweenService } from "@rbxts/services";
import { Make } from "@rbxts/altmake";
import { onLocalPlayerToolEquipped } from "client/utils/tools";


interface Snowmobile extends Model {
    VehicleSeat: VehicleSeat & {
        AttachmentFL: Attachment,
        AttachmentFR: Attachment,
        AttachmentLegR: Attachment,
        AttachmentLegL: Attachment,
        AttachmentHead: Attachment,
    },
    WheelB: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },

    WheelFL: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },
    WheelFR: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },
    LegR: Part,
    LegL: Part,
    Head: Part & {
        Handlebar: Part & {
            AttachmentRight: Attachment,
            AttachmentLeft: Attachment,
        }
    },
    SnowmobileRearBoxModel: Folder & {
        Base: Part & {
            ProximityPrompt: ProximityPrompt;
        }
    },
    HasRearBox: BoolValue,
}

@Component({ tag: TAGS.SnowmobileComponent })
export class SnowmobileComponent extends BaseComponent<{}, Snowmobile> implements OnStart {

    updateProximityPrompts(name?: string) {
        if (name === 'SnowmobileRearBoxTool' && this.instance.HasRearBox.Value === false) {
            this.instance.SnowmobileRearBoxModel.Base.ProximityPrompt.Enabled = true;
        } else {
            this.instance.SnowmobileRearBoxModel.Base.ProximityPrompt.Enabled = false;
        }
    }

    onStart() {
        const tweenInfo = new TweenInfo(.3);

        let ikControlLeft: IKControl | undefined = undefined;
        let ikControlRight: IKControl | undefined = undefined;
        const rss1 = this.instance.VehicleSeat.GetPropertyChangedSignal('Occupant').Connect(() => {
            const occupant = this.instance.VehicleSeat.Occupant as Humanoid;
            if (occupant && Players.LocalPlayer.Character === occupant.Parent) {
                const leftHand = occupant.Parent?.FindFirstChild('LeftHand');
                const leftUpperArm = occupant.Parent?.FindFirstChild('LeftUpperArm');
                const rightHand = occupant.Parent?.FindFirstChild('RightHand');
                const rightUpperArm = occupant.Parent?.FindFirstChild('RightUpperArm');
                if (!leftHand || !rightHand || !leftUpperArm || !rightUpperArm) return;
                ikControlLeft = Make('IKControl', {
                    Parent: occupant,
                    Type: Enum.IKControlType.Transform,
                    EndEffector: leftHand,
                    Target: this.instance.Head.Handlebar.AttachmentLeft,
                    ChainRoot: leftUpperArm,
                })
                ikControlRight = Make('IKControl', {
                    Parent: occupant,
                    Type: Enum.IKControlType.Transform,
                    EndEffector: rightHand,
                    Target: this.instance.Head.Handlebar.AttachmentRight,
                    ChainRoot: rightUpperArm,
                })
            } else {
                if (ikControlLeft) {
                    ikControlLeft.Destroy()
                }
                if (ikControlRight) {
                    ikControlRight.Destroy();
                }
            }
        })

        const rss2 = this.instance.VehicleSeat.GetPropertyChangedSignal('SteerFloat').Connect(() => {
            const turn = -this.instance.VehicleSeat.SteerFloat * this.instance.VehicleSeat.TurnSpeed
            const wheelOrientation = new Vector3(0, turn, 90);
            const legOrientation = new Vector3(0, turn - 90, 0);
            const headOrientation = new Vector3(0, turn, 0);
            TweenService.Create(this.instance.VehicleSeat.AttachmentFL, tweenInfo, { Orientation: wheelOrientation }).Play();
            TweenService.Create(this.instance.VehicleSeat.AttachmentFR, tweenInfo, { Orientation: wheelOrientation }).Play();

            TweenService.Create(this.instance.VehicleSeat.AttachmentLegR, tweenInfo, { Orientation: legOrientation }).Play();
            TweenService.Create(this.instance.VehicleSeat.AttachmentLegL, tweenInfo, { Orientation: legOrientation }).Play();

            TweenService.Create(this.instance.VehicleSeat.AttachmentHead, tweenInfo, { Orientation: headOrientation }).Play();
        });
        const maxAngularVelocity = this.instance.VehicleSeat.MaxSpeed / (this.instance.WheelB.Size.Y / 2);
        const rss3 = this.instance.VehicleSeat.GetPropertyChangedSignal('ThrottleFloat').Connect(() => {
            let appliedTorque = math.abs(this.instance.VehicleSeat.ThrottleFloat * this.instance.VehicleSeat.Torque);
            if (appliedTorque === 0) appliedTorque = 10000;
            this.instance.WheelB.CylindricalConstraint.MotorMaxTorque = appliedTorque;
            const angularVelocity = math.sign(this.instance.VehicleSeat.ThrottleFloat) * maxAngularVelocity;
            this.instance.WheelB.CylindricalConstraint.AngularVelocity = angularVelocity;
        });

        this.instance.HasRearBox.GetPropertyChangedSignal('Value').Connect(() => {
            this.updateProximityPrompts();
        });
        onLocalPlayerToolEquipped((node) => {
            return true
        }, (node) => {
            this.updateProximityPrompts(node.Name);
        }, () => {
            this.updateProximityPrompts();
        });

        this.instance.Destroying.Connect(() => {
            if (ikControlLeft) ikControlLeft.Destroy();
            if (ikControlRight) ikControlRight.Destroy();
            rss1.Disconnect();
            rss2.Disconnect();
            rss3.Disconnect();
        })

    }

}