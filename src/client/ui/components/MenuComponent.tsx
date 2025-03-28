import React, { useState } from "@rbxts/react";
import HelpPage from "./MenuComponentPages/HelpPage";
import CreditsPage from "./MenuComponentPages/CreditsPage";
import DonatePage from "./MenuComponentPages/DonatePage";
import { COLOURS } from "shared/constants";

interface Props {
    isMobile: boolean;
    isOpen: boolean;
    closeMenu: () => void;
}

enum Tabs {
    Help = "Help",
    Credits = "Credits",
    Donate = "Donate",
    Settings = "Settings",
}

export default function MenuComponent(props: Props) {
    const [currentTab, setCurrentTab] = useState(Tabs.Help);
    let tabScreen;
    switch (currentTab) {
        case Tabs.Help:
            tabScreen = <HelpPage />;
            break;
        case Tabs.Credits:
            tabScreen = <CreditsPage />;
            break;
        case Tabs.Donate:
            tabScreen = <DonatePage />;
            break;
    }
    return (
        <frame
            Visible={props.isOpen}
            Size={props.isMobile ? new UDim2(0, 300, 0, 200) : new UDim2(0, 500, 0, 300)}
            Position={props.isMobile ? new UDim2(0.5, -150, 0.5, -100) : new UDim2(0.5, -250, 0.5, -150)}
            BackgroundColor3={COLOURS.White}
            BackgroundTransparency={0.2}
        >
            <uilistlayout FillDirection={"Vertical"} />
            <frame Size={new UDim2(1, 0, 0, 0)} AutomaticSize={"Y"} BackgroundColor3={COLOURS.White}>
                <uilistlayout FillDirection={"Horizontal"} HorizontalFlex={"SpaceBetween"} />
                <frame Size={new UDim2(1, -60, 0, 24)}>
                    <uilistlayout FillDirection={"Horizontal"} SortOrder={"LayoutOrder"} />
                    {[Tabs.Help, Tabs.Donate, Tabs.Credits].map((tab) => {
                        return (
                            <textbutton
                                Text={tab}
                                Size={new UDim2(0, 60, 0, 24)}
                                FontSize={"Size14"}
                                Font={"RobotoMono"}
                                Event={{
                                    MouseButton1Click: () => {
                                        setCurrentTab(tab as Tabs);
                                    },
                                }}
                                BackgroundColor3={tab === Tabs.Donate ? COLOURS.SuccessGreen : COLOURS.UIBaseAlt}
                            />
                        );
                    })}
                </frame>
                <frame Size={new UDim2(0, 60, 0, 24)}>
                    <textbutton
                        Size={new UDim2(0, 60, 0, 24)}
                        Text={"Close"}
                        FontSize={"Size14"}
                        Font={"RobotoMono"}
                        BackgroundColor3={COLOURS.Red}
                        Event={{
                            MouseButton1Click: () => {
                                props.closeMenu();
                            },
                        }}
                    />
                </frame>
            </frame>
            <scrollingframe
                ScrollBarImageColor3={COLOURS.Black}
                Size={new UDim2(1, 0, 1, 0)}
                BackgroundColor3={COLOURS.White}
                AutomaticCanvasSize={'Y'}
            >
                {tabScreen}
            </scrollingframe>
        </frame>
    );
}