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
                    TextureId: 'rbxassetid://74423743848032',
                    ToolTip: 'Clipboard for important notes!'
                })
                clipboard.AddTag(TAGS.ClipboardTool);
                clipboard.Parent = backpack;
                const idBadge = Make('Tool', {
                    Name: 'IDBadgeTool',
                    RequiresHandle: false,
                    CanBeDropped: false,
                    TextureId: 'rbxassetid://88521476043586',
                    ToolTip: 'Your ID badge!'
                })
                idBadge.AddTag(TAGS.IDBadgeTool);
                idBadge.Parent = backpack;
            })
        })
    }
}