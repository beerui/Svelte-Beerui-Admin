import { init, getLocaleFromNavigator, addMessages, locale } from 'svelte-i18n'
import en from '../../locales/en.json'
import zh_cn from '../../locales/zh_cn.json'

addMessages('en', en);
addMessages('zh_cn', zh_cn);

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});

export const changeLang = (lang) => {
    locale.set(lang)
}
