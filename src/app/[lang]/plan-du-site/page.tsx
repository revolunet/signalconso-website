import {newsArticlesData} from '@/components_feature/actualites/newsArticlesData'
import {ContentPageContainer} from '@/components_simple/PageContainers'
import {PageComponentProps, buildGenerateMetadata} from '@/core/metadatas'
import {buildLinkLandingPage, buildLinkNewsArticle, pagesDefs} from '@/core/pagesDefinitions'
import {allVisibleLandings} from '@/landings/landingDataUtils'
import Link from 'next/link'
import {getI18n} from '../../../i18n/I18nDictionnary'

export const generateMetadata = buildGenerateMetadata('planDuSite')

const PlanDuSite = (props: PageComponentProps) => {
  const lang = props.params.lang
  const {messages: m} = getI18n(lang)

  return (
    <>
      <ContentPageContainer>
        <h1>{m.planDuSite.pageTitle}</h1>
        <h2 className="fr-h4">{m.planDuSite.generalPagesSection}</h2>
        <ul>
          <li>
            <Link href={pagesDefs.index.url}>{m.planDuSite.reportIncident}</Link>
          </li>
          <li>
            <Link href={pagesDefs.suiviEtViePrivee.url}>{m.planDuSite.audiencePrivacy}</Link>
          </li>
          <li>
            <Link href={pagesDefs.cookies.url}>{m.planDuSite.cookieManagement}</Link>
          </li>
          <li>
            <Link href={pagesDefs.conditionsGeneralesUtilisation.url}>{m.planDuSite.generalConditions}</Link>
          </li>
          <li>
            <Link href={pagesDefs.accessibilite.url}>{m.planDuSite.accessibilityDeclaration}</Link>
          </li>
          <li>
            <Link href={pagesDefs.planDuSite.url}>{m.planDuSite.siteMap}</Link>
          </li>
          <li>
            <Link href={pagesDefs.quiSommesNous.url}>{m.planDuSite.aboutUs}</Link>
          </li>
          <li>
            <Link href={pagesDefs.commentCaMarche.url}>{m.planDuSite.howItWorks}</Link>
          </li>
          <li>
            <Link href={pagesDefs.stats.url}>{m.planDuSite.statistics}</Link>
          </li>
          <li>
            <Link href={pagesDefs.contact.url}>{m.planDuSite.contact}</Link>
          </li>
          <li>
            <Link href={pagesDefs.delaiRetractation.url}>{m.planDuSite.calcRetractionDelay}</Link>
          </li>
          <li>
            <Link href={pagesDefs.litige.url}>{m.planDuSite.resolutionTips}</Link>
          </li>
        </ul>
        <h2 className="fr-h4">{m.planDuSite.reportIncidentSection}</h2>
        <ul className="">
          {allVisibleLandings(lang).map(landingData => {
            return (
              <li key={landingData.url}>
                <Link href={buildLinkLandingPage(landingData)}>
                  {m.planDuSite.reportIncidentFor} {landingData.title}
                </Link>
              </li>
            )
          })}
          <hr className="mt-4" />
        </ul>
        <p className="mt-4">
          {m.planDuSite.seeFullTree} <Link href={pagesDefs.arborescence.url}>{m.planDuSite.completeTree}</Link>
        </p>

        <h3 className="fr-h6">{m.planDuSite.incidentSteps}</h3>
        <ul>
          <li>{m.planDuSite.step1}</li>
          <li>{m.planDuSite.step2}</li>
          <li>{m.planDuSite.step3}</li>
          <li>{m.planDuSite.step4}</li>
          <li>{m.planDuSite.step5}</li>
        </ul>

        <h2 className="fr-h4">{m.planDuSite.proSpaceSection}</h2>
        <ul>
          <li>
            <Link href={pagesDefs.companyActivation.url}>{m.planDuSite.activateBusinessSpace}</Link>
          </li>
          <li>
            <Link href={pagesDefs.espaceProWelcome.url}>{m.planDuSite.login}</Link>
          </li>
          <li>{m.planDuSite.incidentTracking}</li>
          <li>{m.planDuSite.incidentDetails}</li>
          <li>{m.planDuSite.myCompanies}</li>
          <li>{m.planDuSite.accessManagement}</li>
          <li>{m.planDuSite.passwordModification}</li>
        </ul>
        <h2 className="fr-h4">{m.planDuSite.newsSection}</h2>
        <ul>
          <li>
            <Link href={pagesDefs.actualites.url}>{m.planDuSite.allNews}</Link>
          </li>
          {newsArticlesData
            .filter(_ => _.lang === lang)
            .map(article => {
              return (
                <li key={article.slug}>
                  <Link href={buildLinkNewsArticle(article, {withLangPrefix: true})}>{article.title}</Link>
                </li>
              )
            })}
        </ul>
        <h2 className="fr-h4">{m.planDuSite.dgccrfSpaceSection}</h2>
        <ul>
          <li>
            <Link href={pagesDefs.espaceProWelcome.url}>{m.planDuSite.login}</Link>
          </li>
          <li>{m.planDuSite.incidentTracking}</li>
          <li>{m.planDuSite.incidentDetails}</li>
          <li>{m.planDuSite.companyTracking}</li>
          <li>{m.planDuSite.subscriptions}</li>
          <li>{m.planDuSite.passwordModification}</li>
        </ul>
      </ContentPageContainer>
    </>
  )
}

export default PlanDuSite
