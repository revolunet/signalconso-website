import {Anomaly} from '@/anomalies/Anomaly'
import {NewsArticle} from '@/components_feature/actualites/newsArticlesData'
import {AppLang, AppLangs} from '../i18n/localization/AppLangs'
import {LandingData, allVisibleLandings} from '../landings/landingDataUtils'
import {appConfig} from './appConfig'

type PageDefExternal = {
  isExternal: true
  url: string
}
export type PageDefInternal = {
  isExternal: false
  url: string
  urlRelative: string
  noIndex: boolean
  // Set false if the page has no english version
  // /!\ note that a "notFound()" still has to be manually coded on this page, when the lang is english
  // this boolean only affects the sitemap / metadatas / etc.
  hasEnglishVersion: boolean
}

function page(url: string, options: {noIndex?: boolean; hasEnglishVersion?: boolean} = {}): PageDefInternal {
  const noIndex = options.noIndex ?? false
  const hasEnglishVersion = options.hasEnglishVersion ?? true
  return {
    isExternal: false,
    url,
    hasEnglishVersion,
    // without the leading slash, it becomes a relative link
    // useful for preserving the /webview/ prefix
    urlRelative: url.slice(1),
    noIndex,
  }
}

function pageExternal(url: string): PageDefExternal {
  return {
    isExternal: true,
    url,
  }
}

export const internalPageDefs = {
  index: page('/'),
  arborescence: page(`/arborescence`, {noIndex: true}),
  planDuSite: page(`/plan-du-site`),
  actualites: page(`/actualites`),
  playground: page(`/playground`, {noIndex: true}),
  // all these are available in /webview/
  accessibilite: page(`/accessibilite`, {noIndex: true}),
  commentCaMarche: page(`/comment-ca-marche`),
  conditionsGeneralesUtilisation: page(`/conditions-generales-utilisation`, {noIndex: true}),
  contact: page(`/contact`, {noIndex: true}),
  cookies: page(`/cookies`),
  delaiRetractation: page(`/delai-de-retractation`),
  quiSommesNous: page(`/qui-sommes-nous`),
  stats: page(`/stats`, {hasEnglishVersion: false}),
  suiviEtViePrivee: page(`/suivi-et-vie-privee`),
  litige: page(`/litige`),
  refundTelecom: page(`/remboursement-telecom`),
  obligationFibre: page('/obligation-adsl-fibre', {hasEnglishVersion: false}),
  signalInfluenceur: page('/signaler-un-influenceur', {hasEnglishVersion: false}),
  obsolescencePage: page('/duree-de-vie-produit-obsolescence-programmee', {hasEnglishVersion: false}),
}

const externalPageDefs = {
  centreAide: pageExternal('https://aide.signal.conso.gouv.fr'),
  espaceProWelcome: pageExternal(appConfig.dashboardBaseUrl),
  espaceProConnexion: pageExternal(appConfig.dashboardBaseUrl + '/connexion'),
  companyActivation: pageExternal(appConfig.dashboardBaseUrl + '/activation'),
  lostPassword: pageExternal(appConfig.dashboardBaseUrl + '/perte-mot-de-passe'),
}

// This lists only the simple, unique, hardcoded pages
// There is also
// - the /xxx/faire-un-signalement pages
// - the landing pages (/xxx)
// - the news articles (/actualites/xxx)
// - the review url (/avis/xxx)
// - the /webview/xxx pages
export const pagesDefs = {
  ...internalPageDefs,
  ...externalPageDefs,
}

export function buildLinkStartReport(
  anomaly: Pick<Anomaly, 'path'>,
  lang: AppLang,
  {
    isWebView,
  }: {
    isWebView: boolean
  } = {isWebView: false},
) {
  return isWebView ? `/${lang}/webview/${anomaly.path}` : `/${lang}/${anomaly.path}/faire-un-signalement`
}

export function buildLinkLandingPage(landingData: LandingData) {
  return `/${landingData.lang}/${landingData.url}`
}

// sometimes we need to link a specific landing
// it's hard to reference them in a typesafe way since they're autogenerated
export function buildHardcodedLinkLandingPageFr(url: string): string | undefined {
  const landingData = allVisibleLandings(AppLangs.fr).find(_ => _.url === url)
  return landingData && buildLinkLandingPage(landingData)
}

export function buildLinkLandingPageFromAnomaly(lang: AppLangs, anomaly: Pick<Anomaly, 'path'>) {
  const landings = allVisibleLandings(lang)
  const landing = landings.find(_ => _.url === anomaly.path)
  if (landing) {
    return `/${lang}/${landing.url}`
  }
  return undefined
}

export function buildLinkNewsArticle(article: NewsArticle, {withLangPrefix = false}: {withLangPrefix?: boolean} = {}) {
  return `${withLangPrefix ? `/${article.lang}` : ''}/actualites/${article.slug}`
}

export function buildLinkHomePickCategory() {
  return pagesDefs.index.url + `#${HP_START_REPORT_ANCHOR}`
}

export const HP_START_REPORT_ANCHOR = 'quel-probleme'
