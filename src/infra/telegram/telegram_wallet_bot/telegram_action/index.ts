import { market_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { convertActionContext } from "../../telegram.helper"
import { getUserStorage } from "../telegram_cache/cache.telegram_user_storage"
import { handleWalletConnectURI } from "./action.wallet_connect_uri"

const methodAction = {
    set_wallet_connect_uri: handleWalletConnectURI
}

export const handleBotAction = () => {
    market_bot.on('callback_query', async (ctx) => {
        const { callbackData, userId, callbackId } = convertActionContext(ctx);
        try {
            let dataUserStorage = await getUserStorage(userId)
            const [keyCallback] = callbackData.split('&')
            if (methodAction[keyCallback]) await methodAction[keyCallback](ctx, dataUserStorage)
            await ctx.telegram.answerCbQuery(callbackId)
        } catch (error) {
            ErrorHandler(error, { callbackData, userId }, handleBotAction.name)
            ConvertTeleError(error, market_bot, callbackId)
        }
    });
}