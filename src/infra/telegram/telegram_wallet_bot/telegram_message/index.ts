import { Steps, market_bot } from ".."
import { ConvertTeleError } from "../../telegram.error"
import { convertMessageContext } from "../../telegram.helper"
import { TCacheDataUser, TMessageContext } from "../../telegram.type"
import { TTemplateLanguage, getTemplateMessage } from "../../telegram_template"
import en from '../../telegram_template/en.json'
import zh from '../../telegram_template/zh.json'
import { verify_default_handler } from "../telegram_verify/verify.default_handler"
import { verify_finish_handle } from "../telegram_verify/verify.finish_handle"
import { ErrorHandler } from "../../../../lib/error_handler"
import { getUserStorage } from "../telegram_cache/cache.telegram_user_storage"
import { handleSetWalletConnectURI } from "./handle.set_wallet_connect_uri"

const isButtonMessage = (message: string, language?: TTemplateLanguage) => {
    return [
        getTemplateMessage('btn_user_info', undefined, language),
        getTemplateMessage('btn_buy_energy', undefined, language),
        getTemplateMessage('btn_check_price', undefined, language)
    ].includes(message) || message.startsWith('/')
}

const listenMessageToActionKeyBoard = async (ctx: TMessageContext, language?: TTemplateLanguage) => {
    // const { message, chatId, userId, userFirstName, username, userFullName } = convertMessageContext(ctx)
    // await delUserHandleBuyStep(userId)
    // await delCacheOrderBuyEnergy(userId)
    // switch (message) {
    //     case getTemplateMessage('btn_buy_energy', undefined, language): {
    //         await setUserHandleBuyStep(userId, 'start_buy')
    //         market_bot.telegram.sendMessage(chatId, getTemplateMessage('buy_energy', undefined, language), {
    //             parse_mode: "Markdown",
    //             disable_web_page_preview: true,
    //         })
    //         return
    //     }
    //     case getTemplateMessage('btn_user_info', undefined, language): {
    //         await handleUserInfo(chatId, userId, username, userFullName, language)
    //         return
    //     }
    //     case getTemplateMessage('btn_check_price', undefined, language): {
    //         await handleUserCheckPrice(chatId, userId, language)
    //         return
    //     }
    //     default:
    //         if (message.startsWith('/')) verify_default_handler(message, userId, userFirstName, chatId, language)
    //         break
    // }
}

const listenMessageVerifyStep = async (ctx: TMessageContext, user_storage: TCacheDataUser) => {
    const { message, userId, userFirstName, chatId } = convertMessageContext(ctx)
    const { user_step, language } = user_storage
    try {
        switch (user_step) {
            case Steps.finish:
                if (!Object.values({ ...en, ...zh }).includes(message)) await verify_finish_handle(userId, userFirstName, chatId, language)
                break
            case Steps.set_uri:
                await handleSetWalletConnectURI(ctx, user_storage)
                break
            default:
                if (!message.startsWith('/')) await verify_default_handler(message, userId, userFirstName, chatId, language)
                break
        }
    } catch (error) {
        ErrorHandler(error, { message, userId, userFirstName, chatId }, listenMessageVerifyStep.name)
        ConvertTeleError(error, market_bot, chatId, language)
    }
}

export const handleBotMessage = () => {
    market_bot.on("message", async (ctx) => {
        const { chatType, chatId, message, userId } = convertMessageContext(ctx)
        let dataUserStorage = await getUserStorage(userId)
        if (!dataUserStorage) return
        const { language } = dataUserStorage
        try {
            if (chatType === "group" || chatType === "supergroup") return
            if (isButtonMessage(message, language)) {
                await listenMessageToActionKeyBoard(ctx, language)
            } else {
                await listenMessageVerifyStep(ctx, dataUserStorage)
            }
        } catch (e: any) {
            ErrorHandler(e, { chatType, chatId, message, userId }, handleBotMessage.name)
            ConvertTeleError(e, market_bot, chatId, language)
        }
    })
}