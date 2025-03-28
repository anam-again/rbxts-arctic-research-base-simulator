// https://github.com/MadStudioRoblox/ProfileStore/blob/main/docs/tutorial/index.md
import { OnStart, Service } from "@flamework/core";
import { BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import ProfileStore from "@rbxts/profile-store";
import { linearTimeout } from "shared/utils/tasks";

interface ProfileData {
    purchases: Array<ReceiptInfo>,
    donationPoints: number,
    experience: number,
}

export type PlayerProfileStore = ProfileStore.Profile<ProfileData>

const PROFILE_TEMPLATE: ProfileData = {
    purchases: [],
    donationPoints: 0,
    experience: 0,
}

@Service()
export class ProfileStoreService implements OnStart {

    private PlayerStore = ProfileStore.New("PlayerStore", PROFILE_TEMPLATE)
    public Profiles: Map<number, PlayerProfileStore> = new Map();

    private playerAdded(player: Player) {
        const profile = this.fetchProfileStore(player)
        if (!profile) {
            player.Kick('Profile load failed! Please rejoin.')
        };
        profile.AddUserId(player.UserId);
        profile.Reconcile();
        profile.OnSessionEnd.Connect(() => {
            this.Profiles.delete(player.UserId);
            player.Kick('Session ended. Please rejoin.');
        });
        if (player.Parent === Players) {
            this.Profiles.set(player.UserId, profile);
        } else {
            profile.EndSession();
        }
        this.Profiles.forEach((a) => {
            print(a)
        })
    }

    public fetchProfileStore(player: Player): PlayerProfileStore {
        const localProfile = this.Profiles.get(player.UserId);
        if (localProfile) {
            return localProfile;
        }
        const profile = this.PlayerStore.StartSessionAsync(`${player.UserId}`, {
            Cancel: () => {
                return Players.GetPlayerByUserId(player.UserId) === undefined;
            },
        })
        return profile;
    };

    onStart(): void {
        Players.PlayerAdded.Connect((player) => {
            this.playerAdded(player);
        });
        Players.GetPlayers().forEach((player) => {
            this.playerAdded(player);
        })
        Players.PlayerRemoving.Connect((player) => {
            const profile = this.Profiles.get(player.UserId);
            if (!profile) return;
            profile.EndSession();
        })
    }

    public getWaitProfile(player: Player) {
        const profile = linearTimeout<PlayerProfileStore>(3, 2, () => {
            return this.Profiles.get(player.UserId);
        })
        if (!profile) throw error('failed to load player');
        return profile;
    }
}