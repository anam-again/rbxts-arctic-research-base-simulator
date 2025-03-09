import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";

export class ClientPlayerTriggerAreaExtension {
    public onEnter = new Signal<() => void>();
    public onExit = new Signal<() => void>();

    private triggerArea!: BasePart;
    private playerRoot!: BasePart;

    private playerIsInField = false;

    constructor(triggerArea: BasePart) {
        const asdf = (character: Model) => {
            this.playerRoot = character.WaitForChild("HumanoidRootPart") as BasePart;
        }
        if (Players.LocalPlayer.Character) {
            asdf(Players.LocalPlayer.Character)
        }
        Players.LocalPlayer.CharacterAdded.Connect((character) => {
            asdf(character);
        });
        this.triggerArea = triggerArea;
        task.spawn(() => {
            this.checkCollisions();
        });
    }

    private isPlayerInField() {
        return (
            this.playerRoot.Position.X > this.triggerArea.CFrame.Position.X - this.triggerArea.Size.X / 2 &&
            this.playerRoot.Position.X < this.triggerArea.CFrame.Position.X + this.triggerArea.Size.X / 2 &&
            this.playerRoot.Position.Y > this.triggerArea.CFrame.Position.Y - this.triggerArea.Size.Y / 2 &&
            this.playerRoot.Position.Y < this.triggerArea.CFrame.Position.Y + this.triggerArea.Size.Y / 2 &&
            this.playerRoot.Position.Z > this.triggerArea.CFrame.Position.Z - this.triggerArea.Size.Z / 2 &&
            this.playerRoot.Position.Z < this.triggerArea.CFrame.Position.Z + this.triggerArea.Size.Z / 2
        );
    }

    private checkCollisions() {
        while (true) {
            task.wait(0.2);
            if (this.playerIsInField === false && this.isPlayerInField()) {
                this.playerIsInField = true;
                this.onEnter.Fire();
            } else if (this.playerIsInField === true && !this.isPlayerInField()) {
                this.playerIsInField = false;
                this.onExit.Fire();
            }
        }
    }
}