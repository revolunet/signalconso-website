import {Anomaly} from 'anomalies/Anomaly'
import {appConfig} from './appConfig'
import {LandingData} from 'landings/landingDataUtils'

export const siteMap = {
  index: `/`,
  commentCaMarche: `/comment-ca-marche`,
  suiviEtViePrivee: `/suivi-et-vie-privee`,
  centreAide: `/centre-aide`,
  cookies: `/cookies`,
  contact: `/contact`,
  stats: `/stats`,
  arborescence: `/arborescence`,
  accessibilite: `/accessibilite`,
  planDuSite: `/plan-du-site`,
  quiSommesNous: `/qui-sommes-nous`,
  litige: `/litige`,
  delaiRetractation: `/delai-de-retractation`,
  conditionsGeneralesUtilisation: `/conditions-generales-utilisation`,
  ...(appConfig.showPlayground ? {playground: `/playground`} : null),
}

export const siteMapExternal = {
  connexion: appConfig.dashboardBaseUrl + '/connexion',
  companyActivation: appConfig.dashboardBaseUrl + '/activation',
  lostPassword: appConfig.dashboardBaseUrl + '/perte-mot-de-passe',
}

export function buildLinkStartReport(anomaly: Pick<Anomaly, 'path'>, {isWebView}: {isWebView: boolean} = {isWebView: false}) {
  return isWebView ? `/webview/${anomaly.path}` : `/${anomaly.path}/faire-un-signalement`
}

export function buildLinkLandingPage(landingData: LandingData) {
  return `/${landingData.url}`
}

export function buildLinkLandingPageFromAnomaly(anomaly: Pick<Anomaly, 'path'>) {
  return `/${anomaly.path}`
}
