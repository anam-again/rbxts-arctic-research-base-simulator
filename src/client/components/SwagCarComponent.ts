import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players, TweenService } from "@rbxts/services";
import { onLocalCharacterAdded } from "client/utils/tasks";


interface SwagCar extends Model {
    VehicleSeat: VehicleSeat,
    WheelBL: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },
    WheelBR: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },
    WheelFL: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },
    WheelFR: Part & {
        CylindricalConstraint: CylindricalConstraint,
    },
    Body: Part & {
        AttachmentFL: Attachment,
        AttachmentFR: Attachment,
    }
}

@Component({ tag: TAGS.SwagCarComponent })
export class SwagCarComponent extends BaseComponent<{}, SwagCar> implements OnStart {


    onStart() {

        const tweenInfo = new TweenInfo(.3);
        this.instance.VehicleSeat.GetPropertyChangedSignal('SteerFloat').Connect(() => {
            const turn = -this.instance.VehicleSeat.SteerFloat * this.instance.VehicleSeat.TurnSpeed
            const orientation = new Vector3(0, turn, 90);
            TweenService.Create(this.instance.Body.AttachmentFL, tweenInfo, { Orientation: orientation }).Play();
            TweenService.Create(this.instance.Body.AttachmentFR, tweenInfo, { Orientation: orientation }).Play();
        });
        const maxAngularVelocity = this.instance.VehicleSeat.MaxSpeed / (this.instance.WheelBL.Size.Y / 2);
        this.instance.VehicleSeat.GetPropertyChangedSignal('ThrottleFloat').Connect(() => {
            let appliedTorque = math.abs(this.instance.VehicleSeat.ThrottleFloat * this.instance.VehicleSeat.Torque);
            if (appliedTorque === 0) appliedTorque = 2000;

            this.instance.WheelBL.CylindricalConstraint.MotorMaxTorque = appliedTorque;
            this.instance.WheelBR.CylindricalConstraint.MotorMaxTorque = appliedTorque;

            const angularVelocity = math.sign(this.instance.VehicleSeat.ThrottleFloat) * maxAngularVelocity;
            this.instance.WheelBL.CylindricalConstraint.AngularVelocity = angularVelocity;
            this.instance.WheelBR.CylindricalConstraint.AngularVelocity = angularVelocity;
        });
    }

}