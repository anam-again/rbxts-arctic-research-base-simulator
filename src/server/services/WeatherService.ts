import { OnStart, Service } from "@flamework/core";
import { Lighting, TweenService } from "@rbxts/services";

@Service()
export class WeatherService implements OnStart {
    onStart(): void {
        const dayLength = 480;
        const startTime = 8;
        Lighting.ClockTime = startTime;
        let t1 = TweenService.Create(Lighting, new TweenInfo((((24 - startTime) / 24) * dayLength), Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), { ClockTime: 24 });
        t1.Play();
        t1.Completed.Connect(() => {
            t1 = TweenService.Create(Lighting, new TweenInfo(dayLength, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), { ClockTime: 24 });
            Lighting.ClockTime = 0;
            t1.Play();
        })
    }
}