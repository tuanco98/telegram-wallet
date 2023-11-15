import { market_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { TTemplateLanguage, getTemplateMessage } from "../../telegram_template"

export const verify_finish_handle = async (userId: string, userFirstName: string, chatId: string | number, language?: TTemplateLanguage) => {
    try {
        await market_bot.telegram.sendMessage(chatId, getTemplateMessage('finish', undefined, language))
    } catch (e) {
        ErrorHandler(e, { userId, userFirstName, chatId }, verify_finish_handle.name)
        ConvertTeleError(e, market_bot, chatId, language)
    }
}
