import { ForceReply, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from "telegraf/typings/core/types/typegram";
import { LEVEL_ALERT_THRESHOLDS, TRONSAVE_URL } from "../../../config";
import { handMultipleInlineKeyBoard } from "../telegram.helper";
import { TTemplateLanguage, getTemplateMessage } from ".";

export type TypeAlertMessage = {
    typeValue: 'Bandwidth' | 'Energy'
    address: string
    percentResource: number
    percentThreshold: number
    valueResource: number
    valueLimit: number
}

export type TReplyMarkup = InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined

type ReplyMarkup = {
    market_welcome: TReplyMarkup
    unknown_command: TReplyMarkup
    user_info: TReplyMarkup
}

export class AirdropTelegramBotScript {
    constructor() { }

    public callback_data = {
        unknown_callback: 'unknown_callback',
        confirm_cancel: `confirm_cancel`,
        reject_cancel: `reject_cancel`,
        set_wallet_connect_uri: `set_wallet_connect_uri`
    }
    public reply_markup = (language?: TTemplateLanguage): ReplyMarkup => {
        return {
            market_welcome: {
                resize_keyboard: true,
                force_reply: true,
                keyboard: [
                    [
                        { text: getTemplateMessage('btn_user_info', undefined, language) },
                        { text: getTemplateMessage('btn_buy_energy', undefined, language) },
                    ],
                    [
                        { text: getTemplateMessage('btn_check_price', undefined, language) }
                    ]
                ],
            },
            user_info: {
                resize_keyboard: true,
                force_reply: true,
                inline_keyboard: [
                    [
                        { text: getTemplateMessage('btn_set_wallet_connect_uri', undefined, language), callback_data: this.callback_data.set_wallet_connect_uri },
                    ]
                ],
            },
            unknown_command: {
                resize_keyboard: true,
                force_reply: true,
                one_time_keyboard: true,
            },

        }
    }
    public notify_message = {
        notify_warning: (options: TypeAlertMessage) => {
            const { percentThreshold, valueResource, valueLimit, percentResource, typeValue, address } = options
            const getLastLevelThreshold = Number(LEVEL_ALERT_THRESHOLDS.slice(-1).toString())
            const iconNotification = percentThreshold === getLastLevelThreshold ? '❌' : '⚠️'
            const resultMessage = `${iconNotification} ${typeValue.toUpperCase()} AT LEAST ${percentThreshold}% ${iconNotification}\n\nAddress: ${address}\n${typeValue}: ${valueResource}/${valueLimit}\n% Resource ${typeValue}: ${percentResource}%\n\n`
            return resultMessage
        }
    }
    public entities_message = {
        setBoldMessage: (message: string) => '*' + message + '*',
        setItalicMessage: (message: string) => '_' + message + '_',
        setCodeMessage: (message: string) => '`' + message + '`', // text blue
        setMonoSpaceMessage: (message: string) => '```' + message + '```',
        setUnderlineMessage: (message: string) => '__' + message + '__',
        setSpoilerMessage: (message: string) => '||' + message + '||',
        setStrikeMessage: (message: string) => '~' + message + '~',
        setTextUrlMessage: (message: string, url: string, to_short: boolean = false) => {
            const covertMessage = to_short ? message.replace(message.slice(4, message.length - 4), '...') : message
            return '[' + covertMessage + ']' + '(' + url + ')'
        }
    }
}
