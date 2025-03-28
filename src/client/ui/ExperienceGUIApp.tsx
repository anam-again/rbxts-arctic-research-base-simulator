import { Make } from "@rbxts/altmake";
import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { createRef, useEffect, useState } from "@rbxts/react";
import { TweenService } from "@rbxts/services";
import { Events } from "client/network";
import { COLOURS } from "shared/constants";
import { experienceRequiredPerLevel } from "shared/types/ClientEvents";
import { Queue } from "shared/utils/classes";

interface Props {
}

// https://naviava.hashnode.dev/binary-search-in-typescript
function getLevel(exp: number): number {
    let low = 0;
    let high = experienceRequiredPerLevel.size() - 1;

    while (high - low > 1) {
        const mid = math.floor((low + high) / 2);
        if (experienceRequiredPerLevel[mid] === exp) {
            return mid; // Target found
        } else if (experienceRequiredPerLevel[mid] < exp) {
            low = mid; // Discard the left half
        } else {
            high = mid; // Discard the right half
        }
    }
    return low; // return closest underneath
}

function getPercentProgressUntilNextLevel(exp: number, level: number) {
    const pct = (exp - experienceRequiredPerLevel[level]) / (experienceRequiredPerLevel[level + 1] - experienceRequiredPerLevel[level])
    return pct;
}

export default function ExperienceGUIApp(props: Props) {
    const [levelR, setLevelR] = useState(1);
    const expBarRef = createRef<Frame>();

    const makeUDimExpBar = (fullness: number) => {
        return new UDim2(math.clamp(fullness, .05, 1), -4, 1, -4)
    }

    const getExpBarFullnessUDim = (totalExp: number, currentLevel: number): UDim2 => {
        const fullness = getPercentProgressUntilNextLevel(totalExp, currentLevel);
        return makeUDimExpBar(fullness);
    }

    const expFullness = Make('Frame', {
        Position: new UDim2(0, 2, 0, 2),
        BackgroundTransparency: 0,
        BackgroundColor3: COLOURS.SuccessGreen,
        Size: makeUDimExpBar(0),
    });
    Make('UICorner', {
        Parent: expFullness,
        CornerRadius: new UDim(1, 0)
    })

    useEffect(() => {
        expFullness.Parent = expBarRef.current;
    }, [expBarRef.current])


    useMountEffect(() => {
        let level = 1;
        let experience = 0;
        Events.initExperience.connect((exp) => {
            level = getLevel(exp);
            setLevelR(level);
            experience = exp;
            expFullness.Size = getExpBarFullnessUDim(exp, level);
        });
        const experienceQueue = new Queue<number>();
        let applyExperienceRunning = false;
        let appendAdditional = false;
        Events.addExperience.connect((exp) => {
            experienceQueue.enqueue(exp)
            if (applyExperienceRunning) {
                appendAdditional = true;
                return;
            };
            while (true) {
                applyExperienceRunning = true;
                let experienceToApply = 0;
                for (let i = 0; i < experienceQueue.size(); i++) {
                    const q = experienceQueue.dequeue();
                    if (q) experienceToApply += q;
                }
                appendAdditional = false;
                while (experienceToApply > 0 && level < experienceRequiredPerLevel.size() - 1) {
                    if (experience + experienceToApply >= experienceRequiredPerLevel[level + 1]) {
                        // level up
                        const udim = makeUDimExpBar(1);
                        TweenService.Create(expFullness, new TweenInfo(1), { Size: udim }).Play();
                        task.wait(1);
                        level++;
                        setLevelR(level);
                        expFullness.Size = makeUDimExpBar(0);
                        experienceToApply -= (experienceRequiredPerLevel[level] - experience);
                        experience = experienceRequiredPerLevel[level];
                    } else {
                        // not level up
                        const fullness = getPercentProgressUntilNextLevel(experienceToApply + experience, level);
                        const udim = makeUDimExpBar(fullness);
                        TweenService.Create(expFullness, new TweenInfo(1), { Size: udim }).Play();
                        task.wait(1);
                        experience += experienceToApply;
                        experienceToApply = 0;
                    }
                }
                applyExperienceRunning = false;
                if (!appendAdditional) break;
            }
        })
    })

    return (
        <screengui ClipToDeviceSafeArea={false} IgnoreGuiInset={true}>
            <frame
                Size={new UDim2(0, 500, 0, 20)}
                Position={new UDim2(.5, -250, 0, 2)}
                BackgroundTransparency={.5}
                BackgroundColor3={COLOURS.UIBase}
                ref={expBarRef}
            >
                <uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
                <uicorner CornerRadius={new UDim(1, 0)} />
                <textlabel
                    ZIndex={10}
                    Text={`Level ${levelR}`}
                    TextColor3={COLOURS.White}
                    Size={new UDim2(1, 0, 1, 0)}
                    TextXAlignment={'Center'}
                    TextYAlignment={'Center'}
                    AutomaticSize={'Y'}
                    BackgroundTransparency={1}
                    TextStrokeTransparency={0}
                    TextStrokeColor3={COLOURS.Black}
                />
            </frame>
        </screengui>
    );
}