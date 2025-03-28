import { Controller, OnStart } from "@flamework/core";
import { Lighting } from "@rbxts/services";
import { Events } from "client/network";

@Controller()
export class LightingController implements OnStart {
    onStart(): void {

        Events.setVoidLighting.connect(() => {
            const atmosphere = Lighting.FindFirstChildOfClass('Atmosphere');
            if (!atmosphere) return;
            atmosphere.Color = new Color3(0, 0, 0);
            atmosphere.Decay = new Color3(0, 0, 0);
            atmosphere.Haze = 10;
        })
        Events.setRegularLighting.connect(() => {
            const atmosphere = Lighting.FindFirstChildOfClass('Atmosphere');
            if (!atmosphere) return;
            atmosphere.Color = new Color3(.8, .8, .8);
            atmosphere.Decay = new Color3(.3, .31, .33);
            atmosphere.Haze = .2;
        })
    }
}