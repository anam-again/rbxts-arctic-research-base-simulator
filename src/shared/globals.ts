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
    IDBadgeTool: "IDBadgeTool",
    AnomalyComponent: "AnomalyComponent",
    SwagCarComponent: "SwagCarComponent",
    SnowmobileComponent: "SnowmobileComponent",
    ActivatablePickaxeBoxComponent: "ActivatablePickaxeBoxComponent",
    MineableChemicalComponent: "MineableChemicalComponent",
    MineableChemicalBComponent: "MineableChemicalBComponent",
    ActivatableAlignmentModule1Giver: "ActivatableAlignmentModule1Giver",
    ChemicalEquipmentComponent: "ChemicalEquipmentComponent",
    ShippingContainerComponent: "ShippingContainerComponent",
    SignalAlignerComponent: "SignalAlignerComponent",
    ActivatableAlignmentModule2GiverComponent: "ActivatableAlignmentModule2GiverComponent",
    SnowmobileRearBoxGiverComponent: "SnowmobileRearBoxGiverComponent",
    HiddenAnomalyComponent: "HiddenAnomalyComponent",
    VoidIDCardDoorComponent: "VoidIDCardDoorComponent",
    UntouchableOnDropComponent: "UntouchableOnDropComponent",
    KillOnTouchComponent: "KillOnTouchComponent",
    TalkingCubeComponent: "TalkingCubeComponent",
    Donation100Component: "Donation100Component",
    Donation500Component: "Donation500Component",
    Donation2000Component: "Donation2000Component",
    TextHintsComponent: "TextHintsComponent",
} satisfies Record<string, string>;
Object.keys(TAGS).forEach((key) => {
    assert(key === TAGS[key])
});
export type TAGS_KEYS = keyof typeof TAGS;

export const ASSET_IDS = {
    CoffeeMugTool: 108369305743636, // 137584787690902,
    CookableBurgerTool: 115819020743893, //116704153077026,
    CookedBurgerTool: 89552428204972, // 109745351402128,
    PreppedBurgerTool2: 121574600466640, // 100241786679805,
    Clipboard: 106600905173665,//, // 128185606042620, // ??: 86563167086579
    Pen: 127074242828530, //86378164354783,
    ClipboardAccessory: 77450409016278, // 114464569160938,
    PenAccessory: 111966432901864, //78435256479821,
    BadgeAccessory: 88339842367359, //76427399271380,
    PickaxeTool: 89595696710213, // 120527116086027,
    MineableChemicalTool: 106522310912470, // 103072977236831,
    AlignmentModule1Tool: 77825399865928, // 72597012285606,
    AlignmentModule1: 135851850808089, // 108612750454638,
    AlignmentModule1Base: 79997245040198, // 106253481773936,
    ChemicalBTool: 127515185710655, //118252970193642,
    ReactiveChemicalTool: 128289011516749, // 127325367863018,
    Snowmobile: 74953361987963, // 74955410014277,
    AlignmentModule2Tool: 135613160349941, // 114707488427789,
    AlignmentModule2Model: 78694092953597, // 75574583903553,
    SnowmobileRearBoxTool: 111211992671058, //85391966478223,
    VoidIDCardTool: 84242692991538, //125774208016512,
} satisfies Record<string, number>;

export const ANIMATION_URLS = {
    DrinkCoffee2: "http://www.roblox.com/asset/?id=91573593542504",// "http://www.roblox.com/asset/?id=96148129729514",
    EatingFood: "http://www.roblox.com/asset/?id=137876284308406",// "http://www.roblox.com/asset/?id=76559281245722",
    TakingNotes: "http://www.roblox.com/asset/?id=89978397713404",// "http://www.roblox.com/asset/?id=130338443871191",
    ShowBadge: "http://create.roblox.com/asset/?id=76887885103556" // "http://create.roblox.com/asset/?id=115870545278320",
} satisfies Record<string, string>

export const DEVELOPER_PRODUCTS = {
    Donation100: 3247985790,
    Donation500: 3247986242,
    Donation2000: 3247986432,
} satisfies Record<string, number>
export type DEVELOPER_PRODUCTS_TYPE = keyof typeof DEVELOPER_PRODUCTS;