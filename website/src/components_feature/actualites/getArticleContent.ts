import {ArticleAMF} from '@/components_feature/actualites/ArticleAMF'
import {ArticleAppMobileV2} from '@/components_feature/actualites/ArticleAppMobileV2'
import {ArticleEvolutionsQuantitePrix} from '@/components_feature/actualites/ArticleEvolutionsQuantitePrix'
import {ArticleMagasinsEphemeres} from '@/components_feature/actualites/ArticleMagasinsEphemeres'
import {ArticleOccasionReconditionnes} from '@/components_feature/actualites/ArticleOccasionReconditionnes'
import {ArticleRappelAirbagTakata} from '@/components_feature/actualites/ArticleRappelAirbagTakata'
import {ArticleAccessibilite} from './ArticleAccessibilite'
import {ArticleAchatInternet} from './ArticleAchatInternet'
import {ArticleAmeliorationAccessibilite} from './ArticleAmeliorationAccessibilite'
import {ArticleAppMobile} from './ArticleAppMobile'
import {ArticleCodeBarres} from './ArticleCodeBarres'
import {ArticleConseilsVacancesHiver} from './ArticleConseilsVacancesHiver'
import {ArticleFauxSitesAdministratifs} from './ArticleFauxSitesAdministratifs'
import {ArticleQuestionnaireSiteDgccrf} from './ArticleQuestionnaireSiteDgccrf'
import {ArticleResilierContratsEnLigne} from './ArticleResilierContratsEnLigne'
import {ArticleSignalConsoTraduit} from './ArticleSignalConsoTraduit'
import {ArticleSignalConsoTranslated} from './ArticleSignalConsoTranslated'
import {NewsArticle} from './newsArticlesData'
import {ArticleFauxSitesDeVenteThesee} from '@/components_feature/actualites/ArticleFauxSitesDeVenteThesee'

// We can't put import these JSX directly into the "newsArticlesData"
// it causes too much import problems in the sitemap generation script
export function getArticleContent(slug: NewsArticle['slug']): () => JSX.Element {
  switch (slug) {
    case 'faux-sites-de-vente-thesee':
      return ArticleFauxSitesDeVenteThesee
    case 'rappel-airbag-takata':
      return ArticleRappelAirbagTakata
    case 'signalconso-mobile-app-v2':
      return ArticleAppMobileV2
    case 'magasins-ephemeres':
      return ArticleMagasinsEphemeres
    case 'amf':
      return ArticleAMF
    case 'objets-occasion-reconditionnes':
      return ArticleOccasionReconditionnes
    case 'faux-sites-administratifs':
      return ArticleFauxSitesAdministratifs
    case 'conseils-de-consommation-pour-des-vacances-dhiver-sereines':
      return ArticleConseilsVacancesHiver
    case 'amelioration-de-laccessibilite-de-la-plateforme-signalconso':
      return ArticleAmeliorationAccessibilite
    case 'signalement-par-code-barres':
      return ArticleCodeBarres
    case 'resilier-contrats-en-ligne':
      return ArticleResilierContratsEnLigne
    case 'signalconso-mobile-app-available':
      return ArticleResilierContratsEnLigne
    case 'signalconso-disponible-en-anglais':
      return ArticleSignalConsoTraduit
    case 'signalconso-available-in-english':
      return ArticleSignalConsoTranslated
    case 'signalconso-une-accessibilite-renforcee-pour-tous-les-consommateurs':
      return ArticleAccessibilite
    case 'acheter-sur-internet-en-toute-securite':
      return ArticleAchatInternet
    case 'site-dgccrf-votre-avis-nous-interesse':
      return ArticleQuestionnaireSiteDgccrf
    case 'signalconso-desormais-disponible-en-application-mobile':
      return ArticleAppMobile
    case 'signalconso-reduflation':
      return ArticleEvolutionsQuantitePrix
    default:
      throw new Error(`No article content found for slug: ${slug}`)
  }
}
