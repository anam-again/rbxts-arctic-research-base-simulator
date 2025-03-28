import { Players } from "@rbxts/services";

/**
 * Works for character already exists, and characterAdded
 * @returns CharacterRemoving signal
 */
export function onLocalCharacterAdded(cb: (character: Model) => void) {
    if (Players.LocalPlayer.Character) {
        cb(Players.LocalPlayer.Character);
    }
    Players.LocalPlayer.CharacterAdded.Connect((character) => {
        cb(character);
    })
    return Players.LocalPlayer.CharacterRemoving;
}