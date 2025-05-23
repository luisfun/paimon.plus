import avatar from '@game/avatar.json'
import material from '@game/material.json'
import textMap from '@game/text-map.json'
import weapon from '@game/weapon.json'
import { defaultLang, ui } from '@i18n/ui'

export type Lang = keyof typeof ui
export type TranslationKey = keyof (typeof ui)[typeof defaultLang]
type TextMap = Record<Lang, Record<number, string>>
type Ui = Record<Lang, Record<TranslationKey, string>>

export const getStaticPaths = async () => Object.keys(ui).map(lang => ({ params: { lang } }))

export const getLangFromUrl = (url: URL) => {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as Lang
  return defaultLang
}

export const useTranslations =
  (lang: Lang | URL) =>
  /**
   * ui: (key: ui-key), textHash: (key: hash), name: (key: id, type)
   * @param key
   * @param type
   * @returns
   */
  (key: TranslationKey | number, type?: 'avatar' | 'weapon' | 'material') => {
    const l = lang instanceof URL ? getLangFromUrl(lang) : lang
    if (typeof key === 'number') {
      let hash = key
      switch (type) {
        case 'avatar':
          hash = avatar.find(e => e.id === key)?.nameTextMapHash || 0
          break
        case 'weapon':
          hash = weapon.find(e => e.id === key)?.nameTextMapHash || 0
          break
        case 'material':
          hash = material.find(e => e.id === key)?.nameTextMapHash || 0
          break
      }
      return (textMap as TextMap)[l][hash] || ''
    }
    return (ui as Ui)[l][key] || ui[defaultLang][key]
  }

export const useTranslatedPath =
  (lang: Lang) =>
  (path: string, l: Lang = lang) =>
    `/${l}${path}`
