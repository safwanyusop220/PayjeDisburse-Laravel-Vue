import locales from "."

export type MessageSchema = typeof locales.en
export type Locales = keyof typeof locales

export function getI18NConf() {
	const locale = localStorage.getItem('locale') || 'en';

	return {
		legacy: false,
		locale,
		messages: locales
	}
}
