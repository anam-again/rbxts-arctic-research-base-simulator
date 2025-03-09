import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players } from "@rbxts/services";
import { TAGS } from "shared/globals";
import { onCharacterAdded } from "shared/utils/tasks";

@Service()
export class StarterPlayerService implements OnStart {
    onStart(): void {
        Players.PlayerAdded.Connect((player) => {
            onCharacterAdded(player, (character) => {
                const backpack = player.FindFirstChild('Backpack') as Backpack;
                if (!backpack) throw error('Player doesnt have a backpack');
                const clipboard = Make('Tool', {
                    Name: 'ClipboardTool',
                    RequiresHandle: false,
                    CanBeDropped: false,
                })
                clipboard.AddTag(TAGS.ClipboardTool);
                clipboard.Parent = backpack;
            })
        })
    }
}