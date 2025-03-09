import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { ASSET_IDS, TAGS } from "shared/globals";
import { InsertService } from "@rbxts/services";
import { createToolAndGiveAndEquip } from "server/utils/tools";


interface ActivatableCoffeePot extends Model {
    ProximityPrompt: ProximityPrompt;
}

@Component({ tag: TAGS.ActivatableCoffeePotComponent })
export class ActivatableCoffeePotComponent extends BaseComponent<{}, ActivatableCoffeePot> implements OnStart {

    onStart() {
        this.instance.ProximityPrompt.Triggered.Connect((player) => {
            createToolAndGiveAndEquip(player, ASSET_IDS.CoffeeMugTool, 'CoffeeMugTool2', 'CoffeeMugTool');
        })
    }

    private giveCoffee(player: Player): void {
        const tool = InsertService.LoadAsset(ASSET_IDS.CoffeeMugTool).Clone().WaitForChild("CoffeeMugTool2");
        if (!tool.IsA('Tool')) throw error('Could not find tool in coffee mug model');
        tool.Parent = player.WaitForChild('Backpack');
        const hum = player.Character?.WaitForChild('Humanoid') as Humanoid;
        tool.AddTag(TAGS.CoffeeMugTool);
        if (hum) {
            hum.EquipTool(tool);
        }
    }
}