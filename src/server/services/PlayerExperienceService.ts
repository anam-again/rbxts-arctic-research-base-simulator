import { OnStart, Service } from "@flamework/core";
import { ProfileStoreService } from "./ProfileStoreService";
import { Events } from "server/network";
import { Players } from "@rbxts/services";
import { GuiAdornmentService } from "server/services/GuiAdornmentService";
import { COLOURS } from "shared/constants";
import { experienceRequiredPerLevel } from "shared/types/ClientEvents";
import { DoubletapService } from "./DoubletapService";

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

@Service()
export class PlayerExperienceService implements OnStart {
    constructor(
        private ProfileStoreService: ProfileStoreService,
        private GUIAdornmentService: GuiAdornmentService,
        private DoubletapService: DoubletapService
    ) { }

    public giveExperience(player: Player, exp: number) {
        const profile = this.ProfileStoreService.fetchProfileStore(player);
        const level = getLevel(profile.Data.experience);
        const mul = profile.Data.donationPoints / 1000;
        const bonus = math.floor(exp * mul);
        const total = exp + bonus;
        profile.Data.experience += total;
        if (profile.Data.experience >= experienceRequiredPerLevel[level + 1]) {
            this.GUIAdornmentService.asyncCreateAdornmentText(player, {
                richText: `LEVEL UP!`,
                textColor: COLOURS.BrightYellow,
                textStrokeColor: COLOURS.White,
            });
        }
        Events.addExperience(player, total)
        this.GUIAdornmentService.asyncCreateAdornmentText(player, {
            richText: `+${exp} Exp + ${bonus} bonus! (${mul}x)`,
            textColor: COLOURS.UIBaseAlt,
            textStrokeColor: COLOURS.UIBorderContrast,
        });
    }

    /**
     * @param id Should give the id of the object, not including the player etc.
     */
    public giveDoubletappedExperience(player: Player, exp: number, timeout_ms: number, id: string) {
        if (this.DoubletapService.isDoubletapped(`PlayerExperienceService.${id}.${player.UserId}`, timeout_ms)) {
            this.giveExperience(player, exp);
        }
    }

    onStart(): void {
        Players.PlayerAdded.Connect((player) => {
            const profile = this.ProfileStoreService.getWaitProfile(player);
            Events.initExperience(player, profile.Data.experience)
        })
    }
}