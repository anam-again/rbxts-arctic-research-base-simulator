import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/globals";
import { onLocalPlayerToolEquipped } from "client/utils/tools";
import { Players } from "@rbxts/services";
import { onLocalCharacterAdded } from "client/utils/tasks";


interface HiddenAnomaly extends Part {
    ProximityPrompt: ProximityPrompt;
}

interface ProxProps {
    seat?: Seat | VehicleSeat | undefined;
}

@Component({ tag: TAGS.HiddenAnomalyComponent })
export class HiddenAnomalyComponent extends BaseComponent<{}, HiddenAnomaly> implements OnStart {

    updateProximityPrompt({
        seat,
    }: ProxProps) {
        if (seat && seat.Parent?.Name === 'Snowmobile') {
            const hasRearBox = seat.Parent.FindFirstChild('HasRearBox') as BoolValue;
            const hasAnomaly = seat.Parent.FindFirstChild('HasAnomaly') as BoolValue;
            if (hasRearBox && hasAnomaly && hasRearBox.Value === true && hasAnomaly.Value === false) {
                this.instance.ProximityPrompt.Enabled = true;
            } else {
                this.instance.ProximityPrompt.Enabled = false;
            }
        } else {
            this.instance.ProximityPrompt.Enabled = false;
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