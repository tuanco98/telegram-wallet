import { Context, NarrowedContext } from "telegraf/typings/context"
import { Message, Update } from "telegraf/typings/core/types/typegram"
import { TTemplateLanguage } from "./telegram_template"

type TDataContext = {
    message: string
    messageId: number
    userId: string
    userFirstName: string
    userLastName: string
    userFullName: string
    chatId: number
    username: string
    chatType: string
    timeInSec: number
    startPayload?: string
}

type TDataContextAction = TDataContext & {
    timeEditInSec: number
    callbackData: string
    callbackId: string
}

type TActionContext = NarrowedContext<Context, Update.CallbackQueryUpdate>
type TMessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>

type TCacheDataUser = {
    user_step: string
    language: TTemplateLanguage
}

type TDataOrderBook = {
    min: number,
    max: number,
    value: number
}

export {
    TActionContext, TCacheDataUser, TDataContext, TDataContextAction, TDataOrderBook, TMessageContext
}
