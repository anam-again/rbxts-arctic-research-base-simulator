import { InsertService } from "@rbxts/services";
import { TAGS_KEYS } from "shared/globals";

// TODO update to always have preloaded toolAsset < ----TODO Mar19
export function createToolAndGiveAndEquip(player: Player, toolAssetId: number, tag?: Array<TAGS_KEYS>): void {
    const asset = InsertService.LoadAsset(toolAssetId).Clone()
    const tool = asset.FindFirstChildOfClass('Tool');
    if (!tool) {
        throw error(`could not find child asset ${tool}, ${asset}`);
    }
    giveToolAndEquip(player, tool, tag);

}

export function giveToolAndEquip(player: Player, tool: Tool, tag?: Array<TAGS_KEYS>): void {
    const backpack = player.FindFirstChild('Backpack');
    const humanoid = player.Character?.FindFirstChild('Humanoid') as Humanoid;
    if (!backpack || !humanoid) return;
    tool.Parent = backpack;
    if (tag) {
        tag.forEach((tag) => {
            tool.AddTag(tag);
        })
    }
    humanoid.UnequipTools();
    humanoid.EquipTool(tool);
}