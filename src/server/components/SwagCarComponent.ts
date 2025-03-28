import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { Players, TweenService } from "@rbxts/services";


interface SwagCar extends Model {
    VehicleSeat: VehicleSeat,
}

@Component({ tag: TAGS.SwagCarComponent })
export class SwagCarComponent extends BaseComponent<{}, SwagCar> implements OnStart {

    onStart() {
        this.instance.VehicleSeat.GetPropertyChangedSignal('Occupant').Connect(() => {
            const occupant = this.instance.VehicleSeat.Occupant as Humanoid;
            if (occupant) {
                const player = Players.GetPlayerFromCharacter(occupant.Parent)
                if (player) {
                    this.instance.VehicleSeat.SetNetworkOwner(player);
                }
            } else {
                this.instance.VehicleSeat.SetNetworkOwner();
            }
        })
    }

}