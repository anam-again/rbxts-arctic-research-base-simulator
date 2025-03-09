import { InsertService } from "@rbxts/services";
import { TAGS_KEYS } from "shared/globals";

// TODO update to always have preloaded toolAsset
export function createToolAndGiveAndEquip(player: Player, toolAssetId: number, toolAssetIdName: string, tag?: TAGS_KEYS): void {
    const tool = InsertService.LoadAsset(toolAssetId).Clone().WaitForChild(toolAssetIdName);
    if (!tool) {
        throw error('could not find asset name under toolasset');
    }
    if (tool && !tool.IsA('Tool')) {
        throw error('Illegal tool handed to createToolAndGiveAndEquip')
    }
    giveToolAndEquip(player, tool, tag);

}

export function giveToolAndEquip(player: Player, tool: Tool, tag?: TAGS_KEYS): void {
    const backpack = player.FindFirstChild('Backpack');
    const humanoid = player.Character?.FindFirstChild('Humanoid') as Humanoid;
    if (!backpack || !humanoid) return;
    tool.Parent = backpack;
    if (tag) {
        tool.AddTag(tag);
    }
    humanoid.EquipTool(tool);
}