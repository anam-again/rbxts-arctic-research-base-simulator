import React, { useState } from "@rbxts/react";
import { MarketplaceService, Players } from "@rbxts/services";
import { COLOURS } from "shared/constants";
import { DEVELOPER_PRODUCTS } from "shared/globals";

interface Props { }

export default function DonatePage(props: Props) {
    function bodyText(text: string) {
        return (
            <textlabel
                Text={text}
                Font={"RobotoMono"}
                FontSize={"Size14"}
                Size={new UDim2(1, 0, 0, 0)}
                AutomaticSize={"Y"}
                TextWrap={true}
                BackgroundTransparency={1}
                TextXAlignment={"Left"}
            />
        );
    }

    return (
        <frame
            Size={new UDim2(1, -20, 1, -20)}
            Position={new UDim2(0, 10, 0, 10)}
            BackgroundColor3={COLOURS.White}
            BackgroundTransparency={1}
        >
            <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />
            {bodyText(
                "Please donate if you're able to! It helps keep small Roblox Creators alive and continuing to make games! If you are enjoying the experience, please drop a like+favorite and donate!",
            )}
            {bodyText(
                "You'll get a PERMANENT experience reward for every 100 donated! Plus, you'll help supporting creators building the game!",
            )}
            {bodyText(
                "All first time donations will additionally get you a permanent +50% multiplier!",
            )}
            <frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
                <uistroke Color={COLOURS.Black} />
                <uilistlayout FillDirection={"Vertical"} />
                {bodyText("100 Supporter")}
                {bodyText("Thank you so much for your support! Enjoy your reward!")}
                <textbutton
                    Text={"100 Donation"}
                    Size={new UDim2(0, 100, 0, 50)}
                    BackgroundColor3={COLOURS.SuccessGreen}
                    Event={{
                        MouseButton1Click: () => {
                            MarketplaceService.PromptProductPurchase(Players.LocalPlayer, DEVELOPER_PRODUCTS.Donation100);
                        },
                    }}
                />
            </frame>
            <frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
                <uistroke Color={COLOURS.Black} />
                <uilistlayout FillDirection={"Vertical"} />
                {bodyText("500 SUPER-Supporter")}
                {bodyText("You are my hero if you get this Pass! It means more than you can imagine. Thank you. Enjoy your reward!")}
                <textbutton
                    Text={"SUPER-Supporter"}
                    Size={new UDim2(0, 100, 0, 50)}
                    BackgroundColor3={COLOURS.SuccessGreen}
                    Event={{
                        MouseButton1Click: () => {
                            MarketplaceService.PromptProductPurchase(Players.LocalPlayer, DEVELOPER_PRODUCTS.Donation500);
                        },
                    }}
                />
            </frame>
            <frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
                <uistroke Color={COLOURS.Black} />
                <uilistlayout FillDirection={"Vertical"} />
                {bodyText("2000 SUPER-EXTREME-Supporter")}
                {bodyText("Wow.. You are the brightest star in my sky. Enjoy the MASSIVE reward!")}
                <textbutton
                    Text={"EXTREME-Supporter"}
                    Size={new UDim2(0, 100, 0, 50)}
                    BackgroundColor3={COLOURS.SuccessGreen}
                    Event={{
                        MouseButton1Click: () => {
                            MarketplaceService.PromptProductPurchase(Players.LocalPlayer, DEVELOPER_PRODUCTS.Donation2000);
                        },
                    }}
                />
            </frame>
        </frame>
    );
}