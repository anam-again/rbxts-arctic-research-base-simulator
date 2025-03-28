import { Controller, OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Debris, Players, TweenService } from "@rbxts/services";
import { onCharacterAdded } from "shared/utils/tasks";

export interface AdornmentTextProps {
    richText?: string,
    textColor?: Color3,
    textStrokeColor?: Color3,
}

@Service()
export class GuiAdornmentService implements OnStart {

    private playerAdornmentTextMap: Map<number, Set<TextLabel>> = new Map();

    public asyncCreateAdornmentText(player: Player, props: AdornmentTextProps) {
        task.spawn(() => {
            if (!player) return;
            const character = player.Character;
            if (!character) return;
            const head = character.FindFirstChild('Head') as BasePart;
            if (!head) return;

            const bbgui = Make('BillboardGui', {
                Parent: character,
                Adornee: head,
                StudsOffset: new Vector3(0, 1, 0),
                AlwaysOnTop: true,
                Size: new UDim2(10, 0, 10, 0),
            });
            const text = Make('TextLabel', {
                Parent: bbgui,
                BackgroundTransparency: 1,
                RichText: true,
                Text: props.richText || '',
                Size: new UDim2(1, 0, 1, 0),
                TextXAlignment: Enum.TextXAlignment.Center,
                TextYAlignment: Enum.TextYAlignment.Center,
                Font: Enum.Font.Arcade,
                TextSize: 18,
                TextColor3: props.textColor || new Color3(1, 1, 1),
                TextStrokeColor3: props.textStrokeColor || new Color3(0, 0, 0),
                TextStrokeTransparency: 0,
                BorderSizePixel: 1,
                TextTransparency: 1,
            });
            const map = this.playerAdornmentTextMap.get(player.UserId);
            if (map) {
                map.forEach((t) => {
                    t.Position = t.Position.add(new UDim2(0, 0, 0, -10));
                    t.ZIndex = t.ZIndex - 1
                })
                map.add(text);
            }
            TweenService.Create(text, new TweenInfo(.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), { TextTransparency: 0 }).Play();
            TweenService.Create(bbgui, new TweenInfo(8, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), { StudsOffset: new Vector3(0, 2, 0) }).Play();
            task.wait(7)
            TweenService.Create(text, new TweenInfo(2, Enum.EasingStyle.Cubic, Enum.EasingDirection.In), { TextTransparency: 1 }).Play();
            task.wait(2);
            if (map) {
                map.delete(text);
            }
            text.Destroy();
            bbgui.Destroy();
        });
    }

    onStart(): void {
        Players.PlayerAdded.Connect((player) => {
            this.playerAdornmentTextMap.set(player.UserId, new Set<TextLabel>());
        });
        Players.PlayerRemoving.Connect((player) => {
            this.playerAdornmentTextMap.delete(player.UserId);
        })
    }
}