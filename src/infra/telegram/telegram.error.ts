import { Steps, market_bot, SendMessageByBotMarket } from "./telegram_wallet_bot";
import { internal_payment_system } from '../../index';
import { TCacheDataUser } from "./telegram.type";
import { TTemplate, TTemplateLanguage, getTemplateMessage } from "./telegram_template";
import { SendAnswerCbQueryByBot, SendMessageByBot } from "./telegram.helper";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

type TTeleErrorList = keyof typeof TeleErrorList

export const TeleErrorList = {
    'RLS:212 ADDRESS_INVALID': "ADDRESS_INVALID",
    'RLS:233 USER_TELE_NOT_FOUND': 'USER_TELE_NOT_FOUND',
    'RLS:234 INVALID_CACHE_ORDER_IN_TELE': "INVALID_CACHE_ORDER_IN_TELE",
    'RLS:235 INVALID_CACHE_USER_STORAGE_IN_TELE': "INVALID_CACHE_USER_STORAGE_IN_TELE",
    'RLS:236 USER_REF_NOT_FOUND': "USER_REF_NOT_FOUND",
    'RLS:237 CONTACT_NOT_EXISTS': "CONTACT_NOT_EXISTS",
    'RLS:443 INVALID_USERNAME_TELEGRAM': "INVALID_USERNAME_TELEGRAM",
}

const handleSendMessageError = async (bot_tele: Telegraf<Context<Update>>, contextId: string, errorKey: TTeleErrorList, arg?: object, language?: TTemplateLanguage) => {
    const convertErrKey = errorKey.toLowerCase() as TTemplate
    const message = getTemplateMessage(convertErrKey, arg, language)
    return contextId.length < 19 ? await SendMessageByBot(bot_tele, contextId, message) : await SendAnswerCbQueryByBot(bot_tele, contextId, message)
}

// contextId: callbackID || chatId

export const ConvertTeleError = async (e: any, bot_tele: Telegraf<Context<Update>>, contextId: string | number, language?: TTemplateLanguage) => {
    const message = e.message as string
    if (!TeleErrorList[message]) {
        await handleSendMessageError(bot_tele, contextId.toString(), 'error' as TTeleErrorList, undefined, language)
    } else {
        await handleSendMessageError(bot_tele, contextId.toString(), TeleErrorList[message], undefined, language)
    }
    return
}