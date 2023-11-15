import { market_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { SendMessageByBot, convertActionContext } from "../../telegram.helper"
import { TActionContext, TCacheDataUser } from "../../telegram.type"
import { getTemplateMessage } from "../../telegram_template"
import { setUserStorage } from "../telegram_cache/cache.telegram_user_storage"

export const handleWalletConnectURI = async (ctx: TActionContext, dataUserStorage: TCacheDataUser) => {
    const { language } = dataUserStorage
    const { userId, chatId, messageId, callbackId } = convertActionContext(ctx)
    try {
        console.log('run');
        
        await setUserStorage(userId, { ...dataUserStorage, user_step: 'set_uri' })
        const message = getTemplateMessage('use_wallet_connect_uri')
        SendMessageByBot(market_bot, chatId, message)
    } catch (error) {
        ErrorHandler(error, { userId, chatId, messageId }, handleWalletConnectURI.name)
        ConvertTeleError(error, market_bot, callbackId)
    }
}