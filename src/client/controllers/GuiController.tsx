import { Controller, OnStart } from "@flamework/core";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { Make } from "@rbxts/altmake";
import React from "@rbxts/react";

import CommonGUIApp from "client/ui/CommonGUIApp";
import ExperienceGUIApp from "client/ui/ExperienceGUIApp";


@Controller({})
export class CommonGUIController implements OnStart {
    private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

    onStart() {
        const experienceFolder = Make("Folder", {
            Parent: this.playerGui,
            Name: "ExperienceGUIApp",
        });
        const experienceRoot = createRoot(experienceFolder);
        experienceRoot.render(createPortal(<ExperienceGUIApp />, experienceFolder, "ExperienceGUIApp"));
        const commonFolder = Make("Folder", {
            Parent: this.playerGui,
            Name: "CommonGUIApp",
        });
        const commonRoot = createRoot(commonFolder);
        commonRoot.render(createPortal(<CommonGUIApp />, commonFolder, "CommonGUIApp"));
    }
}