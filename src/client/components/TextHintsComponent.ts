import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { TextChatService } from "@rbxts/services";

interface TextHint extends Model {
    Board: Part & {
        ProximityPrompt: ProximityPrompt
    },
    TextSource: Part
}

interface TextBubbleConfig {
    text: string,
    delay: number,
}

type HintName = 'Science2Board' | 'SuperLabBoard' | 'Building1Board' | 'Building1Board2' | 'DormBuildingBoard' |
    'AnomalyBoard' | 'MineBoard' | 'SnowmobileBoard' | 'RadioBoard' | 'SignalAlignerBoard' | 'SatteliteBoard'
    | 'FrozenBoard' | 'RemoteBoard' | 'RemoteAnomalyBoard';

@Component({ tag: TAGS.TextHintsComponent })
export class TextHintsComponent extends BaseComponent<{}, TextHint> implements OnStart {

    private thread: thread | undefined;
    private createSpeakingThread(textSource: BasePart, texts: Array<TextBubbleConfig>) {
        if (this.thread) {
            task.cancel(this.thread);
        }
        this.thread = task.spawn(() => {
            texts.forEach((textInfo) => {
                TextChatService.DisplayBubble(textSource, textInfo.text);
                task.wait(textInfo.delay);
            })
        });
    }

    private startTextResponse(key: HintName, source: BasePart) {
        switch (key) {
            case 'Science2Board':
                this.createSpeakingThread(source, [
                    { text: 'Jonothan says he lost the beacon to the other base...', delay: 6 },
                    { text: 'On the roof?', delay: 5 },
                    { text: 'How did he lose it up there???', delay: 8 },
                    { text: 'Maybe he thought if he waved it hard enough, he could shake a new signal into it.', delay: 10 },
                    { text: 'I am reporting this to Andre.', delay: 5 },
                    { text: '[Nothing else is written]', delay: 7 },
                ])
                break;
            case 'SuperLabBoard':
                this.createSpeakingThread(source, [
                    { text: 'ATTENTION STAFF: The super lab is....', delay: 6 },
                    { text: 'I have no idea.', delay: 2 },
                    { text: 'Broken?', delay: 4 },
                    { text: 'I am not sure, but we DEFINITELY can not get in right now.', delay: 7 },
                    { text: 'And if anyone has seen Jonothan, report to me immediately!', delay: 6 },
                    { text: 'Thank you!', delay: 5 },
                ])
                break;
            case 'Building1Board':
                this.createSpeakingThread(source, [
                    { text: 'Staff Bulletin: New roommates!', delay: 5 },
                    { text: 'Due to the lab failure that caused Building 3 to turn into ice, we will be having those scientists working here in Building 1.', delay: 10 },
                    { text: 'We will be doing a Post-Mortem in the next few weeks to understand why this massive failure occured.', delay: 8 },
                    { text: 'Preliminary investigation has shown that it has something to do with the chemical being processed there.', delay: 8 },
                    { text: 'Thank you!', delay: 8 },
                ])
                break;
            case 'Building1Board2':
                this.createSpeakingThread(source, [
                    { text: '[March3, Amanda]: Hey, can we put another request in for coffee to get shipped here?', delay: 6 },
                    { text: '[March3, Andre]: I thought we just got a shipment a few days ago.. what happened to it all?', delay: 6 },
                    { text: '[March4, Amanda]: We had a bit of a misshap, there was a', delay: 4 },
                    { text: '[The rest of the document is covered in coffee stains]', delay: 4 },
                ])
                break;
            case 'DormBuildingBoard':
                this.createSpeakingThread(source, [
                    { text: 'ATTENTION STAFF: ', delay: 3 },
                    { text: 'Due to the recent "Monkey Incident"', delay: 5 },
                    { text: 'Jumping on the beds is now EXPRESSLY FORBIDDEN', delay: 10 },
                    { text: 'Thank you. - Andre', delay: 4 },
                ])
                break;
            case 'AnomalyBoard':
                this.createSpeakingThread(source, [
                    { text: '[March14, Amanda]: Has the inland base sent their results on the Anomoly back yet?', delay: 8 },
                    { text: '[March15, Jonothan]: No.', delay: 5 },
                    { text: '[March15, Amanda]: Thank you for your input Jonothan.', delay: 5 },
                    { text: '[March15, Jonothan]: I am going to go visit them', delay: 4 },
                    { text: '[March15, Amanda]: Can you log that with Andre?', delay: 6 },
                    { text: '[There is nothing else written]', delay: 6 },
                ])
                break;
            case 'MineBoard':
                this.createSpeakingThread(source, [
                    { text: 'Congratulations to our employee of the month Jonothan Guy Andy!', delay: 6 },
                    { text: 'Jonothan somehow managed to dig out this entire tunnel in two days!', delay: 6 },
                    { text: 'Jonothan says it was easy, but did not give us any insight into how he did it.', delay: 6 },
                    { text: 'Some new ore is even exposed! Which is exciting for the team.', delay: 6 },
                    { text: 'Thank you for your dedication Jonothan!', delay: 8 },
                ])
                break;
            case 'SnowmobileBoard':
                this.createSpeakingThread(source, [
                    { text: '[March8 Jonothan]: Hey guys, some weird green Ice has closed the Snowmobile crate? Has anyone seen this before?', delay: 6 },
                    { text: '[March8 Andre]: I heard this reported at the inland base, it was not easy to remove.', delay: 6 },
                    { text: '[March8 Jonothan]: How did they remove it? I need to get my snowmobile from inside', delay: 4 },
                    { text: '[Nothing else is written]', delay: 3 },
                ])
                break;
            case 'RadioBoard':
                this.createSpeakingThread(source, [
                    { text: 'ATTENTION STAFF:', delay: 3 },
                    { text: 'Get OFF the radio tower!', delay: 4 },
                    { text: 'Thank you!', delay: 4 },
                ])
                break;
            case 'SignalAlignerBoard':
                this.createSpeakingThread(source, [
                    { text: '[March6 Bacon]: What happened to the alignment modules?', delay: 6 },
                    { text: '[March9 Bacon]: Does nobody know? All of ours were destroyed from the frozen lab.', delay: 6 },
                    { text: '[March10 Amanda]: A different employee has misplaced them.', delay: 6 },
                    { text: '[March10 Bacon]: Alright? And they have not re-found them yet or what?', delay: 6 },
                    { text: '[March10 Amanda]: Ask Andre.', delay: 4 },
                    { text: '[March10 Bacon]: Uh, alright. This is going to delay our connection to the Field Anomaly until we get reconnected though.', delay: 4 },
                    { text: '[Nothing else is written]', delay: 7 },
                ])
                break;
            case 'SatteliteBoard':
                this.createSpeakingThread(source, [
                    { text: '[Bacon]: Is it just me or do these Sattelites look.. fake?', delay: 6 },
                    { text: '[Bacon]: All of the underlying mechanics have been broken so far.', delay: 5 },
                    { text: '[Bacon]: I am not sure what this could mean, hopefully I can fix them soon.', delay: 5 },
                    { text: '[Nothing else is written]', delay: 7 },
                ])
                break;
            case 'FrozenBoard':
                this.createSpeakingThread(source, [
                    { text: '[March2 Bacon]: Today we are combining the Caves Chemical with the one they recently dug up at the Mine.', delay: 7 },
                    { text: '[March2 Bacon]: Preliminary tests came back fine, but I am worried for some reason.', delay: 7 },
                    { text: '[March2 Bacon]: We were able to use the resultant chemical to melt the Green Ice that has been showing up randomly.', delay: 5 },
                    { text: '[Nothing else is written]', delay: 7 },
                ])
                break;
            case 'RemoteBoard':
                this.createSpeakingThread(source, [
                    { text: 'The snowmobile carriers were left here after this place was abandoned.', delay: 7 },
                    { text: 'Why did we leave these behind??', delay: 4 },
                    { text: 'I should install one on my snowmobile so I can carry stuff.', delay: 4 },
                ])
                break;
            case 'RemoteAnomalyBoard':
                this.createSpeakingThread(source, [
                    { text: 'I found this anomoly out here...', delay: 5 },
                    { text: 'But I have no way to carry it back to the larger anomaly!', delay: 5 },
                    { text: 'I think I will go check out the hidden base.. Maybe something there will help me..', delay: 7 },
                ])
                break;
        }
    }

    onStart() {
        const hintName = this.instance.Name as HintName;
        if (!hintName) return;
        this.instance.Board.ProximityPrompt.Triggered.Connect(() => {
            this.startTextResponse(hintName, this.instance.TextSource);
        })
    }

}