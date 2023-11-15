import { market_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { web3wallet } from "../../../wallet_connect"
import { ConvertTeleError } from "../../telegram.error"
import { convertMessageContext } from "../../telegram.helper"
import { TCacheDataUser, TMessageContext } from "../../telegram.type"

export const handleSetWalletConnectURI = async (ctx: TMessageContext, user_storage: TCacheDataUser) => {
    const { message, userId, chatId, username } = convertMessageContext(ctx)
    const { language } = user_storage
    try {
        await web3wallet.pair({ uri: message })
    } catch (error) {
        ErrorHandler(error, {}, handleSetWalletConnectURI.name)
        ConvertTeleError(error, market_bot, chatId, language)
    }
}