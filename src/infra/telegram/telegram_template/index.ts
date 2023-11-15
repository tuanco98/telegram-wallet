import en from './en.json';
import zh from './zh.json';

const file = {
    en,
    zh
}

enum EFlag {
    '🇬🇧' = 'en',
    '🇨🇳' = 'zh'
}

type TTemplateLanguage = keyof typeof file
type TTemplate = keyof typeof file.en

const getTemplateMessage = (template: TTemplate, args?: object, language: TTemplateLanguage = 'en') => {
    let message: string = file[language][template] || file['en'][template]
    if (!args) return message
    Object.keys(args).forEach(key => {
        message = message.replace(`{{${key}}}`, args[key])
    })
    return message
}

export {
    getTemplateMessage,
    TTemplate,
    TTemplateLanguage,
    EFlag
}