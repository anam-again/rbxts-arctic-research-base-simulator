import { RunService } from "@rbxts/services";

// https://devforum.roblox.com/t/is-there-any-way-i-can-tween-pivotto/1918057/8
const tweens: Map<Model, RBXScriptConnection> = new Map();
export function tweenModelPivot(object: Model, t: number, newCFrame: CFrame) {
    const tween = tweens.get(object);
    if (tween) {
        tween.Disconnect();
        tweens.delete(object);
    }

    let startCFrame = object.GetPivot();
    let steps = 1 / t;
    let currentStep = 0;

    const newTween = RunService.Stepped.Connect((t, dt) => {
        currentStep += steps * dt;
        if (currentStep > 1) {
            tweens.get(object)?.Disconnect();
            tweens.delete(object);
        }
        object.PivotTo(startCFrame.Lerp(newCFrame, currentStep));
    })
    tweens.set(object, newTween);
}