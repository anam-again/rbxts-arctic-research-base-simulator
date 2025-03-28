import React, { useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { COLOURS } from "shared/constants";
import MenuComponent from "./components/MenuComponent";

interface Props { }

export default function CommonGUIApp(props: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    UserInputService.LastInputTypeChanged.Connect((lastInputType) => {
        switch (lastInputType) {
            case Enum.UserInputType.Touch:
            case Enum.UserInputType.Gyro:
                setIsMobile(true);
                break;
            default:
                setIsMobile(false);
        }
    });

    return (
        <screengui ClipToDeviceSafeArea={false} IgnoreGuiInset={true}>
            <textbutton
                Size={new UDim2(0, 100, 0, 30)}
                Position={new UDim2(1, -120, 0, 10)}
                BackgroundColor3={COLOURS.UILighter}
                Transparency={0.6}
                Text={"Menu"}
                FontSize={"Size10"}
                TextColor3={COLOURS.White}
                TextXAlignment={"Center"}
                TextYAlignment={"Center"}
                Font={"RobotoMono"}
                Event={{
                    MouseEnter: (element) => {
                        element.Transparency = 0.1;
                    },
                    MouseLeave: (element) => {
                        element.Transparency = 0.8;
                    },
                    MouseButton1Click: () => {
                        setMenuIsOpen(!menuIsOpen);
                    },
                }}
            />
            <MenuComponent
                closeMenu={() => {
                    setMenuIsOpen(false);
                }}
                isOpen={menuIsOpen}
                isMobile={isMobile}
            />
        </screengui>
    );
}