import { market_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { TTemplateLanguage, getTemplateMessage } from "../../telegram_template"

export const verify_default_handler = async (message: string, userId: string, userFirstName: string, chatId: string | number, language?: TTemplateLanguage) => {
    try {
        console.log(`${userId}-${userFirstName}: ${message}`)
        market_bot.telegram.sendMessage(chatId, getTemplateMessage('unknown_command', undefined, language))
    } catch (e) {
        ErrorHandler(e, { message, userId, userFirstName, chatId }, verify_default_handler.name)
        ConvertTeleError(e, market_bot, chatId, language)
    }
}