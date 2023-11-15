import { Steps, bot_script, SendMessageByBotMarket, market_bot } from '..';
import { ConvertTeleError } from '../../telegram.error';
import { convertBalance, convertMessageContext, generateRefCode } from '../../telegram.helper';
import { TMessageContext } from '../../telegram.type';
// import { setUserStorage } from '../telegram_cache/cache.telegram_user_storage';
import { TTemplateLanguage, getTemplateMessage } from '../../telegram_template';
import { internal_payment_system } from '../../../..';
import { convertTimeTommDDDyyyy } from '../../../../lib/utils';
import { TELEGRAM_MARKET_BOT_NAME, TRONSAVE_URL } from '../../../../config';
import { ErrorHandler } from '../../../../lib/error_handler';
import { mongo } from '../../../database/mongo/mongo';
import { setUserStorage } from '../telegram_cache/cache.telegram_user_storage';

const DEFAULT_SPONSOR = '0x0'

export const verify_welcome_handler = async (ctx: TMessageContext, language?: TTemplateLanguage) => {

    const session = mongo.startSession()
    const { userId, chatId, username, startPayload, userFullName } = convertMessageContext(ctx)
    try {
        session.startTransaction()
        console.log('run');

        const dataUser = await internal_payment_system.GetOrCreateAccount(userId, undefined, session)
        await session.commitTransaction()
        const userAddress = dataUser.link_tron_account.address
        if (dataUser) await setUserStorage(userId, { user_step: Steps.finish, language: 'en' })
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
        })
        SendMessageByBotMarket(message, chatId, bot_script.reply_markup(language).user_info)
    } catch (e) {
        if (session?.inTransaction()) await session.abortTransaction()
        ErrorHandler(e, { userId, userFullName, chatId }, verify_welcome_handler.name)
        ConvertTeleError(e, market_bot, chatId, language)
    } finally {
        await session.endSession()
    }
}