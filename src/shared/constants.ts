export const COLOURS = {
    Black: new Color3(0, 0, 0),
    White: new Color3(1, 1, 1),
    UIBase: new Color3(0.16, 0.41, 0.64),
    UIBaseAlt: new Color3(0.05, 0.47, 0.47),
    UILighter: new Color3(0.49, 0.64, 0.75),
    UIDarker: new Color3(0.15, 0.23, 0.23),
    UIBorderContrast: new Color3(0.41, 0.6, 0.54),
    Red: new Color3(1, 0, 0),
    SuccessGreen: new Color3(0.02, 0.61, 0.22),
    BrightYellow: new Color3(1, 0.98, 0.08)
} satisfies Record<string, Color3>;

export const FONTS = {
    Title: Enum.Font.Michroma,
    Main: Enum.Font.Ubuntu,
    Mono: Enum.Font.RobotoMono,
    Highlight: Enum.Font.Jura,
} satisfies Record<string, Enum.Font>;

export const FONT_SIZE = {
    Common: 16,
};