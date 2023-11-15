import crypto from 'crypto';
// import QRCode from 'qrcode';
import { TDataContext, TDataContextAction } from "./telegram.type";
import { TTemplate, TTemplateLanguage, getTemplateMessage } from "./telegram_template";
import { TReplyMarkup } from './telegram_template/template_message';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TELEGRAM_WALLET_BOT_TOKEN } from '../../config';

//TODO: Haven't found a way to get the input context yet
const convertMessageContext = (ctx: any): TDataContext => {
    const message = ctx.message['text']
    const messageId = ctx.message.message_id
    const userId = ctx.from.id.toString()
    const userFirstName = ctx.from.first_name
    const userLastName = ctx.from.last_name
    const chatId = ctx.chat.id
    const username = ctx.from?.username || ""
    const chatType = ctx.message.chat.type
    const timeInSec = ctx.message.date
    const startPayload = ctx.startPayload
    const userFullName = userFirstName + userLastName
    return { message, messageId, userId, userFirstName, chatId, username, chatType, timeInSec, userLastName, startPayload, userFullName }
}

const convertActionContext = (ctx: any): TDataContextAction => {
    const message = ctx.update.callback_query.message['text'] || ""
    const messageId = ctx.update.callback_query.message?.message_id || ""
    const userId = ctx.from?.id.toString() || ""
    const userFirstName = ctx.from?.first_name || ""
    const userLastName = ctx.from?.last_name || ""
    const chatId = ctx.chat?.id || ""
    const username = ctx.from?.username || ""
    const chatType = ctx.update.callback_query.message?.chat.type
    const timeInSec = ctx.update.callback_query.message?.date
    const timeEditInSec = ctx.update.callback_query.message['edit_date']
    const callbackData = ctx.update.callback_query['data'] || ""
    const callbackId = ctx.update.callback_query.id
    const userFullName = userFirstName + userLastName
    return { message, messageId, userId, userFirstName, chatId, username, chatType, timeInSec, userLastName, timeEditInSec, callbackData, callbackId, userFullName }
}

const generateRefCode = (value: number = 7) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < value; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// const generateQRCodeBase64 = async (address: string) => {
//     const dataQRCode = await QRCode.toDataURL(address, { width: 250, margin: 1 })
//     return Buffer.from(dataQRCode.slice(22), 'base64')
// }

const handMultipleInlineKeyBoard = (template: TTemplate, callbackKey: string, language?: TTemplateLanguage) => {
    const message = getTemplateMessage(template, undefined, language).split('_')
    return message.reduce((previousValue: any[], currentValue: string, currentIndex: number) => {
        let _previousValue = [...previousValue]
        if (!_previousValue[Math.floor(currentIndex / 3)]) _previousValue[Math.floor(currentIndex / 3)] = []
        _previousValue[Math.floor(currentIndex / 3)].push({ text: currentValue, callback_data: `${callbackKey}&${currentValue}` })
        return _previousValue
    }, [])
}



const verifyTelegramWebAppData = async (telegramInitData: string) => {
    const encoded = decodeURIComponent(telegramInitData);
    const secret = crypto.createHmac('sha256', 'WebAppData').update(TELEGRAM_WALLET_BOT_TOKEN);
    const arr = encoded.split('&');
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));
    const hash = arr.splice(hashIndex)[0].split('=')[1];
    arr.sort((a, b) => a.localeCompare(b));
    const dataCheckString = arr.join('\n');
    const _hash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');
    return _hash === hash;
};

const abbreviateNumber = (value: number) => {
    const suffixes = ["", "k", "m", "b", "t"];
    const base = Math.floor(Math.log10(Math.abs(value)) / 3);
    const decimal = value / Math.pow(10, base * 3);
    return `${decimal}${suffixes[base]}`;
}

const convertTimeToMDYHM = (date: Date | string | number | undefined | null) => {
    if (!date) return "TBA"
    const new_date = new Date(date).toLocaleString('en-US', { timeZone: 'UTC' }).replace(',', '')
    return new_date.slice(0, new_date.length - 11)
}

const SendMessageByBot = (bot_tele: Telegraf<Context<Update>>, chatId: string | number, message: string, reply_markup?: TReplyMarkup) => {
    return bot_tele.telegram.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup
    })
}

const SendAnswerCbQueryByBot = async (bot_tele: Telegraf<Context<Update>>, contextId: string, message: string) => {
    await bot_tele.telegram.answerCbQuery(contextId, message, { show_alert: true })
}

const generateCodeVerify = (userId: string) => {
    let code: string = ''
    while (code.length < 6) {
        const number = Math.floor(Math.random() * 10)
        code += number.toString()
    }
    return `${userId}-${code}`
}


export {
    abbreviateNumber, convertActionContext,
    convertMessageContext, convertTimeToMDYHM,
    // generateQRCodeBase64, 
    generateRefCode, handMultipleInlineKeyBoard,
    verifyTelegramWebAppData, SendMessageByBot, generateCodeVerify,
    SendAnswerCbQueryByBot
};
