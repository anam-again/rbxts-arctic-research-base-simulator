import { onLocalCharacterAdded } from "./tasks"

/**
 * Did we add an instance to local player of checkParam
 * @param checkParam Checks the node found
 * @param cbEquip do this on equip
 * @param cbUnequip do this on unequip
 * @returns none
 */
export function onLocalPlayerToolEquipped(checkParam: (node: Instance) => boolean, cbEquip: (node: Instance) => void, cbUnequip: (node: Instance) => void) {
    let ToolEquipped: RBXScriptConnection | undefined | void = undefined;
    let ToolUnequipped: RBXScriptConnection | undefined | void = undefined;
    onLocalCharacterAdded((character) => {
        ToolEquipped = character.ChildAdded.Connect((node) => {
            if (checkParam(node)) {
                cbEquip(node);
            }
        });
        ToolUnequipped = character.ChildRemoved.Connect((node) => {
            if (checkParam(node)) {
                cbUnequip(node);
            }
        });
    }).Connect(() => {
        if (ToolEquipped) ToolEquipped.Disconnect();
        if (ToolUnequipped) ToolUnequipped.Disconnect();
    });
}