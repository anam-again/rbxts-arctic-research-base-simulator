import React, { useState } from "@rbxts/react";
import { COLOURS } from "shared/constants";

interface Props { }

export default function HelpPage(props: Props) {
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
            <frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
                <uistroke Color={COLOURS.Black} />
                <uilistlayout FillDirection={"Vertical"} />
                {bodyText("Welcome to the Research Base!")}
            </frame>
            <frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
                <uistroke Color={COLOURS.Black} />
                <uilistlayout FillDirection={"Vertical"} />
                {bodyText("Donate under the donation tab to increase your experience gained multiplier PERMANENTLY!")}
            </frame>
            <frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
                <uistroke Color={COLOURS.Black} />
                <uilistlayout FillDirection={"Vertical"} />
                {bodyText("Make sure you check inside your backpack for newly acquired items!")}
            </frame>
        </frame>
    );
}