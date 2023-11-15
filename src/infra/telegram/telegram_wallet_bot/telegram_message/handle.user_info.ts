import { bot_script, market_bot } from ".."
import { internal_payment_system } from "../../../.."
import { TELEGRAM_MARKET_BOT_NAME, TRONSAVE_URL } from "../../../../config"
import { ERROR_CODE, ErrMsg, ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { SendMessageByBot, convertBalance } from "../../telegram.helper"
import { TTemplateLanguage, getTemplateMessage } from "../../telegram_template"

export const handleUserInfo = async (chatId: number | string, userId: string, username: string, userFullName: string, language?: TTemplateLanguage) => {
    try {
        const dataUser = await internal_payment_system.GetAccountById(userId)
        if (!dataUser) throw ErrMsg(ERROR_CODE.USER_TELE_NOT_FOUND)
        const userAddress = dataUser.link_tron_account.address
        const balance = convertBalance(Number(dataUser.balance))
        const linkRefTele = bot_script.entities_message.setCodeMessage(`https://t.me/${TELEGRAM_MARKET_BOT_NAME}?start=test`)
        const linkRefWeb = bot_script.entities_message.setCodeMessage(`${TRONSAVE_URL}?ref=test`)
        const convertUserAddress = bot_script.entities_message.setCodeMessage(userAddress)
        const message = getTemplateMessage('user_info', {
            address: convertUserAddress,
            username: bot_script.entities_message.setCodeMessage(username ? `@${username}` : userFullName),
            balance,
            linkRefTele,
            linkRefWeb
        }, language)
        await SendMessageByBot(market_bot, chatId, message, bot_script.reply_markup(language).user_info)
    } catch (error) {
        ErrorHandler(error, {}, handleUserInfo.name)
        ConvertTeleError(error, market_bot, chatId, language)
    }
}