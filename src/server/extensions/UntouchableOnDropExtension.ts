interface Props {
    timeout: number,
}

export class UntouchableOnDropExtension {

    private isOwnedByPlayer(instance: Instance): boolean {
        return (instance.Parent && instance.Parent.IsA('Model') && instance.Parent.FindFirstChild('HumanoidRootPart')?.IsA('BasePart')) ?? false;
    }

    constructor(instance: Instance, props: Props = {
        timeout: 2
    }) {

        const handle = instance.FindFirstChild('Handle') as BasePart;
        let held = this.isOwnedByPlayer(instance);
        if (!handle) return;

        instance.AncestryChanged.Connect(() => {
            if (instance.Parent === undefined) return;
            if (this.isOwnedByPlayer(instance)) { // if is owned by player
                if (!held) {
                    held = true;
                    handle.CanTouch = true;
                }
            } else {
                if (held) { // if just dropped
                    held = false;
                    handle.CanTouch = false;
                    task.wait(props.timeout)
                    handle.CanTouch = true;
                }
            }
        })
    }

}