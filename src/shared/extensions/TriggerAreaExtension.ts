import Signal from "@rbxts/signal";

export class TriggerAreaExtension {
    public onEnter = new Signal<(part: BasePart) => void>();
    public onExit = new Signal<(part: BasePart) => void>();

    private triggerArea!: Region3;
    private isPartInAreaMap = new Map<Part, boolean>();


    constructor(triggerArea: Region3) {
        this.triggerArea = triggerArea;
        task.spawn(() => {
            this.checkCollisions();
        });
    }

    public addTrackedObject(part: BasePart) {

    }

    public removeTrackedObject() {

    }

    private isPartInField(part: BasePart) {
        return (
            part.Position.X > this.triggerArea.CFrame.Position.X - this.triggerArea.Size.X / 2 &&
            part.Position.X < this.triggerArea.CFrame.Position.X + this.triggerArea.Size.X / 2 &&
            part.Position.Y > this.triggerArea.CFrame.Position.Y - this.triggerArea.Size.Y / 2 &&
            part.Position.Y < this.triggerArea.CFrame.Position.Y + this.triggerArea.Size.Y / 2 &&
            part.Position.Z > this.triggerArea.CFrame.Position.Z - this.triggerArea.Size.Z / 2 &&
            part.Position.Z < this.triggerArea.CFrame.Position.Z + this.triggerArea.Size.Z / 2
        );
    }

    private checkCollisions() {
        while (true) {
            task.wait(0.5);
            this.isPartInAreaMap.forEach((isInField, part) => {
                if (part.Parent === undefined) {
                    this.isPartInAreaMap.delete(part);
                }
                if (isInField === false && this.isPartInField(part)) {
                    this.isPartInAreaMap.set(part, true);
                    this.onEnter.Fire(part);
                } else if (isInField === true && !this.isPartInField(part)) {
                    this.isPartInAreaMap.set(part, false);
                    this.onExit.Fire(part);
                }
            })
        }
    }
}