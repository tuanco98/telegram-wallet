import { market_bot } from "..";
import { ConvertTeleError } from "../../telegram.error";
import { convertMessageContext } from "../../telegram.helper";
import { getTemplateMessage } from "../../telegram_template";
import { verify_start_handler } from "../telegram_verify/verify.start_handler";
import { IS_SERVER_MAINTAINED } from "../../../../config";
import { ErrorHandler } from "../../../../lib/error_handler";
import { getUserStorage } from "../telegram_cache/cache.telegram_user_storage";

export const handleBotStart = () => {
    market_bot.start(async (ctx) => {
        const { userId, chatId } = convertMessageContext(ctx)
        try {
            const dataUserStorage = await getUserStorage(userId)
            if (IS_SERVER_MAINTAINED) {
                await market_bot.telegram.sendMessage(ctx.chat.id, getTemplateMessage('server_maintain', undefined, dataUserStorage?.language), {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                })
                return
            }
            if (ctx.message.chat.type === "group" || ctx.message.chat.type === "supergroup") {
                return
            }
            await verify_start_handler(ctx, dataUserStorage || undefined)
        } catch (error) {
            ErrorHandler(error, {}, handleBotStart.name)
            ConvertTeleError(error, market_bot, chatId)
        }
    })
}