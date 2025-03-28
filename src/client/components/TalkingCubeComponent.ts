import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { TextChatService, TweenService } from "@rbxts/services";


interface TalkingCube extends Part {
    ProximityPrompt: ProximityPrompt;
    TextPoint: Part,
}

@Component({ tag: TAGS.TalkingCubeComponent })
export class TalkingCubeComponent extends BaseComponent<{}, TalkingCube> implements OnStart {

    private runningDialogue: thread | undefined;
    private dialogue() {
        if (this.runningDialogue) {
            task.cancel(this.runningDialogue)
        }
        this.runningDialogue = task.spawn(() => {
            this.sayAndDelay('Well done... You have won.', 5);
            this.sayAndDelay('But this is not the end.', 3);
            this.sayAndDelay('There is so much left to do!', 3);
            this.sayAndDelay('The mysteries of this place are endless...', 5);
            this.sayAndDelay('Please press the nearby buttons to donate to the game, to add more things to do!.', 6);
            this.sayAndDelay('This will also increase your experience multiplier, so that you can do more things in less time!', 6);
            this.sayAndDelay('Thank you for playing!', 5);
            this.sayAndDelay('I hope you enjoyed.', 3);
        })
    }

    private sayAndDelay(text: string, delay: number) {
        TextChatService.DisplayBubble(this.instance.TextPoint, text);
        task.wait(delay);
    }

    onStart() {
        TweenService.Create(this.instance, new TweenInfo(12, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, math.huge), { Rotation: this.instance.Rotation.add(new Vector3(360, 360, 360)) }).Play();
        this.instance.ProximityPrompt.Triggered.Connect(() => {
            this.dialogue();
        })
    }

}