import { bot_script, market_bot, SendMessageByBotMarket } from ".."
import { ConvertTeleError } from "../../telegram.error"
import { convertMessageContext } from "../../telegram.helper"
import { TCacheDataUser, TMessageContext } from "../../telegram.type"
import { getTemplateMessage } from "../../telegram_template"
import { verify_welcome_handler } from "./verify.welcome_handler"
import { ErrorHandler } from "../../../../lib/error_handler"
import { verify_continue_handle } from "./verify.continue_handle"

export const verify_start_handler = async (ctx: TMessageContext, user_storage?: TCacheDataUser) => {
    const { userId, chatId, username, userFirstName, userLastName } = convertMessageContext(ctx)
    try {
        console.table({ userId, username, userFirstName, command: '/Start' })
        if (user_storage?.user_step) {
            await verify_continue_handle(ctx, user_storage)
            return
        }
        const userFullName = userFirstName + userLastName
        const message = getTemplateMessage("welcome", { username: username || userFullName }, user_storage?.language)
        SendMessageByBotMarket(message, chatId)
        await verify_welcome_handler(ctx, user_storage?.language)
    } catch (e) {
        ErrorHandler(e, { userId, userFirstName, chatId }, verify_start_handler.name)
        ConvertTeleError(e, market_bot, chatId, user_storage?.language)
    }
}
