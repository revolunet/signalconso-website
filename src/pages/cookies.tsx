import {Page} from 'components_simple/Page/Page'
import {Panel, PanelBody} from 'components_simple/Panel/Panel'
import {siteMap} from 'core/siteMap'
import Head from 'next/head'
import {pageDefinitions} from 'core/pageDefinition'
import {ContentPageContainer} from 'components_simple/ContentPageContainer'
import Link from 'next/link'

const Cookies = () => {
  return (
    <>
      <Head>
        <title>{pageDefinitions.cookies.title}</title>
        <meta name="description" content={pageDefinitions.cookies.description} />
      </Head>
      <ContentPageContainer>
        <h1>Gestion des cookies</h1>
        <h2 className="fr-h4">Ce site n’affiche pas de bannière de consentement aux cookies, pourquoi ?</h2>
        <p>
          C’est vrai, vous n’avez pas eu à cliquer sur un bloc qui recouvre la moitié de la page pour dire que vous êtes d’accord
          avec le dépôt de cookies — même si vous ne savez pas ce que ça veut dire !
        </p>
        <p>
          Rien d’exceptionnel, pas de passe-droit lié à un .gouv.fr. Nous respectons simplement la loi, qui dit que certains
          outils de suivi d’audience, correctement configurés pour respecter la vie privée, sont exemptés d’autorisation
          préalable.
        </p>
        Les cookies techniques mis en place nous permettent :
        <br />
        <p>
          D’obtenir des statistiques anonymes sur la fréquentation du site afin de faire de l'analyse de contenu et détecter
          d'éventuels problèmes de navigation;
        </p>
        <h2 className="fr-h4">Cookies</h2>
        <p>
          Définition : Le cookie est un petit fichier texte enregistré par le navigateur de votre ordinateur, tablette ou
          smartphone. Le cookie, enregistré sur votre ordinateur lorsque vous consultez le site SignalConso, permet de conserver
          des données utilisateur décrites ci-dessous afin de faciliter la navigation et de permettre certaines fonctionnalités.
        </p>
        <h3 className="fr-h6">Nature des cookies déposés sur le site SignalConso:</h3>
        <p>
          Nous n'utilisons que des cookies techniques qui permettent et facilitent votre navigation. Certains sont indispensables
          et ne sauraient être supprimés sans affecter gravement l’accès au site et la navigation, d’autres auraient pour
          conséquence une navigation dégradée.
        </p>
        <h3 className="fr-h6">Liste des cookies déposés</h3>
        <p>Les cookies d'analyse de mesure d'audience (Eulerian / Matomo):</p>
        <table className="fr-table">
          <thead>
            <tr>
              <th>Nom du cookie</th>
              <th>Finalité</th>
              <th>Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>etuix</td>
              <td>Cookie Eulerian</td>
              <td>13 mois</td>
            </tr>
            <tr>
              <td>_Pk_id</td>
              <td>Matomo</td>
              <td>13 mois</td>
            </tr>
            <tr>
              <td>_Pk_ref</td>
              <td>Matomo</td>
              <td>6 mois</td>
            </tr>
            <tr>
              <td>_Pk_session</td>
              <td>Matomo</td>
              <td>30 minutes</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>
          Afin de mieux vous servir et d’améliorer l’expérience utilisateur sur notre site, nous mesurons son audience grâce à une
          solution utilisant la technologie des cookies.
        </p>
        <p>
          Les données collectées permettent de fournir uniquement des données statistiques anonymes de fréquentation (le nombre de
          pages vues, le nombre de visites, leur fréquence de retour, …).
        </p>
        <p>
          Nous utilisons l‘outil de mesure d’audience Eulerian. Cet outil est dispensé du recueil de consentement de l'internaute
          relatif au dépôt des cookies Analytics, l'autorité française de protection des données (CNIL) ayant accordé une
          exemption au cookie Web Analytics d’Eulerian (
          <Link target="_blank" href="https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience">
            en savoir plus
          </Link>
          ).
        </p>
        <p>
          Aucune des données personnelles ne sont exploitées par le site SignalConso. Cela signifie que votre adresse IP, par
          exemple, est anonymisée avant d’être enregistrée. Il est donc impossible d’associer vos visites sur ce site à votre
          personne.
        </p>
        <p>
          Les noms des cookies utilisés sont pour Eulerian Etuix. Leur durée de conservation est de 13 mois. Elles ne sont pas
          cédées à des tiers ni utilisées à d'autres fins.
        </p>
        <p>
          Il en est de même pour l’outil de mesure d’audience de Matomo qui permet de conserver l’historique des données de
          statistiques anonymes de fréquentation récoltées depuis le lancement de SignalConso
        </p>
        <p>
          Les noms des cookies utilisés sont pour Matomo _pk_session, _pk_id, _pk_ref. Leur durée va de de 30 mn à 13 mois. Elles
          ne sont pas cédées à des tiers ni utilisées à d'autres fins.
        </p>
        <p>
          Pour plus de renseignements sur la gestion de la vie privée sur Signal Conso, vous pouvez également consulter la
          rubrique <Link href={siteMap.suiviEtViePrivee}>suivi d'audience et vie privée</Link>
        </p>
        <h3 className="fr-h6">Comment accepter ou refuser les cookies:</h3>
        <p>
          Vous avez la possibilité de paramétrer leur navigateur pour supprimer les cookies déjà installés sur leur terminal, pour
          être invités à accepter ou refuser l’installation de cookies au cas par cas ou pour accepter ou refuser automatiquement
          tous les cookies pour certains sites ou pour tous les sites. Toutefois, le refus d’utilisation des cookies peut empêcher
          certaines fonctionnalités du site de fonctionner.
        </p>
        <p>
          Les paramétrages de gestion des cookies varient selon les navigateurs. Les instructions à ce sujet pour les navigateurs
          les plus courants sont disponibles en cliquant sur les liens ci-dessous:
        </p>
        <ul>
          <li>
            <Link
              target="_blank"
              href="https://support.microsoft.com/fr-fr/help/17442/windows-internet-explorer-delete-manage-cookies"
            >
              Internet Explorer
            </Link>
            <p>
              Dans Internet Explorer, cliquez sur le bouton Outils, puis sur Options Internet. Sous l'onglet Général, sous
              Historique de navigation, cliquez sur Paramètres. Cliquez sur le bouton Afficher les fichiers. Cliquez sur l'en-tête
              de colonne Nom pour trier tous les fichiers dans l'ordre alphabétique, puis parcourez la liste jusqu'à ce que vous
              voyez des fichiers commençant par le préfixe "Cookie". (tous les cookies possèdent ce préfixe et contiennent
              habituellement le nom du site Web qui a créé le cookie). Sélectionnez le ou les cookies comprenant le nom "à
              compléter" et supprimez-les Fermez la fenêtre qui contient la liste des fichiers, puis cliquez deux fois sur OK pour
              retourner dans Internet Explorer.
            </p>
          </li>
          <li>
            <Link target="_blank" href="https://privacy.microsoft.com/fr-FR/windows-10-microsoft-edge-and-privacy">
              Edge
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://support.google.com/chrome/answer/95647?hl=fr">
              Chrome
            </Link>
            <p>
              Ouvrez Google Chrome. Dans la barre d'outils du navigateur, cliquez sur Plus. Placez votre curseur sur Plus
              d'outils, puis cliquez sur Effacer les données de navigation. Dans la fenêtre "Effacer les données de navigation",
              cochez les cases Cookies et données d'autres sites ou plug-in et Images et fichiers en cache. Utilisez le menu en
              haut pour sélectionner la quantité de données que vous souhaitez supprimer. Sélectionnez Depuis le début pour tout
              supprimer. Cliquez sur Effacer les données de navigation.
            </p>
          </li>
          <li>
            <Link href="https://support.mozilla.org/fr/kb/empecher-sites-enregistrer-preferences?esab=a&s=blocking+cookies&r=2&as=s">
              Firefox
            </Link>
            <p>
              Allez dans l'onglet "Outils" du navigateur puis sélectionnez le menu "Options" Dans la fenêtre qui s'affiche,
              choisissez "Vie privée" et cliquez sur "supprimer des cookies spécifiques" Repérez les fichiers qui contiennent le
              nom "à compléter". Sélectionnez-les et supprimez-les.
            </p>
          </li>
          <li>
            <Link target="_blank" href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac">
              Safari
            </Link>
            <p>
              Dans votre navigateur, choisissez le menu Édition {'>'} Préférences. Cliquez sur Sécurité. Cliquez sur Afficher les
              cookies. Sélectionnez les cookies qui contiennent le nom "à compléter" et cliquez sur Effacer ou sur Tout effacer.
              Après avoir supprimé les cookies, cliquez sur Terminé.
            </p>
          </li>
        </ul>
        <p>
          Pour plus de renseignements sur les cookies et la façon de paramétrer votre navigateur, vous pouvez également consulter{' '}
          <Link target="_blank" href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser">
            le site de la CNIL
          </Link>
        </p>
      </ContentPageContainer>
    </>
  )
}

export default Cookies
