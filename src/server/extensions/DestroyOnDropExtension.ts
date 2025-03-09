import { Workspace } from "@rbxts/services";

interface Props {
    timeout: number,
}

export class DestroyOnDropExtension {

    private instance!: Instance;

    constructor(instance: Instance, props: Props = {
        timeout: 15
    }) {
        this.instance = instance;

        this.instance.AncestryChanged.Connect((_, parent) => {
            if (parent === Workspace) {
                task.wait(props.timeout);
                if (this.instance.Parent === Workspace) {
                    this.instance.Destroy();
                }
            }
        })
    }

}