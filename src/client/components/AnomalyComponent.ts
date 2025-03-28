import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { TweenService } from "@rbxts/services";
import { onLocalCharacterAdded } from "client/utils/tasks";


interface Anomaly extends Part {
    Prompt: Part & {
        ProximityPrompt: ProximityPrompt;
    },
    GreenButton: Part,
    InsertAnomalyPrompt: ProximityPrompt;
    InsertedAnomaly: BoolValue;
}

interface ProxProps {
    seat?: Seat | VehicleSeat | undefined;
}

@Component({ tag: TAGS.AnomalyComponent })
export class AnomalyComponent extends BaseComponent<{}, Anomaly> implements OnStart {

    updateProximityPrompt({
        seat,
    }: ProxProps) {
        if (seat && seat.Parent?.Name === 'Snowmobile') {
            const hasAnomaly = seat.Parent.FindFirstChild('HasAnomaly') as BoolValue;
            if (hasAnomaly && hasAnomaly.Value === true) {
                this.instance.InsertAnomalyPrompt.Enabled = true;
            } else {
                this.instance.InsertAnomalyPrompt.Enabled = false;
            }
        } else {
            this.instance.InsertAnomalyPrompt.Enabled = false;
        }
    }

    onStart() {
        let rss1: RBXScriptConnection | undefined;
        let rss2: RBXScriptConnection | undefined;
        onLocalCharacterAdded((character) => {
            const humanoid = character.FindFirstChildOfClass('Humanoid');
            if (humanoid) {
                rss1 = humanoid.Seated.Connect((_, seat) => {
                    if (rss2) rss2.Disconnect();
                    this.updateProximityPrompt({
                        seat
                    });
                    if (seat && seat.Parent?.Name === 'Snowmobile') {
                        const hasAnomaly = seat.Parent.FindFirstChild('HasAnomaly') as BoolValue;
                        if (hasAnomaly) {
                            rss2 = hasAnomaly.GetPropertyChangedSignal('Value').Connect(() => {
                                this.updateProximityPrompt({ seat });
                            })
                        }
                    }
                })
            }
        }).Connect(() => {
            if (rss1) rss1.Disconnect();
            if (rss2) rss2.Disconnect();
        })
    }

}