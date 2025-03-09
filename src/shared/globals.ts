import Object from "@rbxts/object-utils";

export const TAGS = {
    ActivatableCoffeePotComponent: "ActivatableCoffeePotComponent",
    CoffeeMugTool: "CoffeeMugTool",
    CookableBurgerComponent: "CookableBurgerComponent",
    ActivatableBurgerBoxComponent: "ActivatableBurgerBoxComponent",
    DestroyOnDropComponent: "DestroyOnDropComponent",
    BurgerPrepStationComponent: "BurgerPrepStationComponent",
    PreppedBurgerComponent: "PreppedBurgerComponent",
    ClipboardTool: "ClipboardTool",
} satisfies Record<string, string>;
Object.keys(TAGS).forEach((key) => {
    assert(key === TAGS[key])
});
export type TAGS_KEYS = keyof typeof TAGS;

export const ASSET_IDS = {
    CoffeeMugTool: 137584787690902,
    CookableBurgerTool: 116704153077026,
    CookedBurgerTool: 109745351402128,
    PreppedBurgerTool2: 100241786679805,
    Clipboard: 128185606042620,
    Pen: 86378164354783,
    ClipboardAccessory: 114464569160938,
    PenAccessory: 78435256479821,
} satisfies Record<string, number>;

export const ANIMATION_URLS = {
    DrinkCoffee2: "http://www.roblox.com/asset/?id=96148129729514",
    EatingFood: "http://www.roblox.com/asset/?id=76559281245722",
    TakingNotes: "http://www.roblox.com/asset/?id=130338443871191"
} satisfies Record<string, string>