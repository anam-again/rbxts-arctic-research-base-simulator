// https://create.roblox.com/docs/reference/engine/classes/MarketplaceService#ProcessReceipt
import { OnStart, Service } from "@flamework/core";
import { MarketplaceService, Players } from "@rbxts/services";
import { PlayerProfileStore, ProfileStoreService } from "./ProfileStoreService";
import { DEVELOPER_PRODUCTS, DEVELOPER_PRODUCTS_TYPE } from "shared/globals";
import { GuiAdornmentService } from "server/services/GuiAdornmentService";


@Service()
export class ReceiptService implements OnStart {

    constructor(private ProfileStoreService: ProfileStoreService, private guiAdornmentService: GuiAdornmentService) { }

    onStart(): void {
        MarketplaceService.ProcessReceipt = (recieptInfo: ReceiptInfo) => {
            return this.handleReceipt(recieptInfo);
        };
    }

    private purchaseDonation100(player: Player, profile: PlayerProfileStore): boolean {
        profile.Data.donationPoints += 100;
        profile.Save();
        this.guiAdornmentService.asyncCreateAdornmentText(player, {
            richText: 'Added 100 Donation Points!',
            textColor: new Color3(1, 0.93, 0.01),
            textStrokeColor: new Color3(1, 1, 1)
        })
        return true;
    }

    private purchaseDonation500(player: Player, profile: PlayerProfileStore): boolean {
        profile.Data.donationPoints += 500;
        profile.Save();
        this.guiAdornmentService.asyncCreateAdornmentText(player, {
            richText: 'Added 500 Donation Points!',
            textColor: new Color3(1, 0.93, 0.01),
            textStrokeColor: new Color3(1, 1, 1)
        })
        return true;
    }

    private purchaseDonation2000(player: Player, profile: PlayerProfileStore): boolean {
        profile.Data.donationPoints += 2000;
        profile.Save();
        this.guiAdornmentService.asyncCreateAdornmentText(player, {
            richText: 'Added 2000 Donation Points!',
            textColor: new Color3(1, 0.93, 0.01),
            textStrokeColor: new Color3(1, 1, 1)
        })
        return true;
    }

    private handleReceipt(receiptInfo: ReceiptInfo): Enum.ProductPurchaseDecision {
        let actionFunction: (player: Player, profile: PlayerProfileStore) => boolean;
        let product: DEVELOPER_PRODUCTS_TYPE;
        const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
        if (!player) return Enum.ProductPurchaseDecision.NotProcessedYet;
        const profile = this.ProfileStoreService.fetchProfileStore(player);
        if (!profile) return Enum.ProductPurchaseDecision.NotProcessedYet;
        if (!receiptInfo) {
            return Enum.ProductPurchaseDecision.NotProcessedYet;
        }
        switch (receiptInfo.ProductId) {
            case DEVELOPER_PRODUCTS.Donation100:
                actionFunction = (player: Player, profile: PlayerProfileStore) => this.purchaseDonation100(player, profile);
                product = 'Donation100';
                break;
            case DEVELOPER_PRODUCTS.Donation500:
                actionFunction = (player: Player, profile: PlayerProfileStore) => this.purchaseDonation500(player, profile);
                product = 'Donation500';
                break;
            case DEVELOPER_PRODUCTS.Donation2000:
                actionFunction = (player: Player, profile: PlayerProfileStore) => this.purchaseDonation2000(player, profile);
                product = 'Donation2000';
                break;
            default:
                print('[ERROR] Illegal product id supplied to processReceipt');
                return Enum.ProductPurchaseDecision.NotProcessedYet;
        };
        const success = actionFunction(player, profile);
        if (success) {
            return Enum.ProductPurchaseDecision.PurchaseGranted;
        } else {
            return Enum.ProductPurchaseDecision.NotProcessedYet;
        }
    }

}