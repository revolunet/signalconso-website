import {Page} from 'shared/Page/Page'
import {Panel, PanelBody} from 'shared/Panel/Panel'
import {siteMap} from 'core/siteMap'
import Link from 'next/link'
import Head from 'next/head'
import {pageDefinitions} from 'core/pageDefinition'

const SuiviEtViePrivee = () => {
  return (
    <Page size="small" className="blog">
      <Head>
        <title>{pageDefinitions.suiviEtViePrivee.title}</title>
        <meta name="description" content={pageDefinitions.suiviEtViePrivee.description} />
      </Head>
      <h1>Suivi d'audience et vie privée</h1>
      <Panel>
        <PanelBody>
          <h2>Données personnelles</h2>
          <p>
            Les informations recueillies dans le formulaire de SignalConso sont enregistrées dans un fichier informatisé par
            l’équipe SignalConso (DGCCRF) pour permettre aux professionnels de se corriger et permettre à la DGCCRF de suivre les
            signalements à des fins de contrôle. La base légale du traitement est la mission de service public de la DGCCRF,
            habilitée à contrôler et sanctionner les manquements relatifs au code de la consommation (L511-3 Code Conso et L450-1
            Code Commerce)
            <br />
            Les informations demandées lors du dépôt du signalement sont nécessaires pour traiter les signalements. En
            particulier, l'adresse email pourra être utilisée par le site pour informer le consommateur du suivi de son
            signalement (système de notification). <br />
            Les informations relatives au signalement (c’est-à-dire la déclaration et les pièces jointes) sont conservées 5 ans
            par la DGCCRF pour les besoins des enquêtes et les suites éventuelles.
          </p>
          <p>
            La DGCCRF, en sa qualité d’exploitant du site, s'engage à n'opérer aucune commercialisation des informations
            personnelles transmises par l'usager, Les déclarations peuvent faire l’objet d'un retraitement statistique par
            l’administration dans le cadre de ses missions. Les informations présentes sur le site public ne comportent pas de
            données nominatives et sont mises à disposition de manière libre et gratuite sur le site&nbsp;
            <a href="https://data.economie.gouv.fr">https://data.economie.gouv.fr</a> à fréquence régulière.
          </p>
          <p>
            L’utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles
            sur simple demande
            <a
              href="mailto:support@signal.conso.gouv.fr"
              title="support@signal.conso.gouv.fr (ouverture de la messagerie par défaut)"
            >
              par email.
            </a>
          </p>
          <p>
            {' '}
            Consultez le site cnil.fr pour plus d’informations sur vos droits. Si vous estimez, après nous avoir contactés, que
            vos droits « Informatique et Libertés » ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL.
          </p>

          <hr />

          <h2>Droit d'accès aux données</h2>
          <p>
            Conformément au Règlement 2016/679 du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du
            traitement des données à caractère personnel et à la libre circulation de ces données (RGPD) et à la loi n°78-17 du 6
            janvier 1978 relative à l'informatique, aux fichiers et aux libertés modifiée, les personnes concernées par ce
            traitement de données personnelles peuvent accéder aux données les concernant, les rectifier, demander leur
            effacement.
          </p>
          <p>
            L’utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles
            sur simple demande par email. Ecrivez-nous à{' '}
            <a href="mailto:support@signal.conso.gouv.fr">support@signal.conso.gouv.fr</a>.
          </p>
          <p>
            Pour exercer vos droits ou pour toute question sur le traitement de vos données vous pouvez contacter le référent de
            la protection des données de la DGCCRF:
          </p>
          <ul>
            <li>
              Par voie postale:
              <br />
              <cite>
                Le référent protection des données - DGCCRF - Bureau 2D
                <br />
                59 boulevard Vincent Auriol
                <br />
                75703 Paris Cedex 13.
              </cite>
            </li>
            <br />
            <li>
              Par voie électronique: <br />
              <a href="mailto:referent-pod@dgccrf.finances.gouv.fr">referent-pod@dgccrf.finances.gouv.fr</a>
            </li>
          </ul>
          <p>
            Vous disposez également d’un droit à la limitation du traitement de vos données. Consultez le site &nbsp;
            <a href="https://www.cnil.fr/">https://www.cnil.fr</a> pour plus d’informations sur vos droits.
          </p>
          <p>
            Enfin, vous disposez également du droit d'introduire une réclamation auprès de l'autorité de contrôle. L'exercice de
            ce droit s'effectue auprès de la CNIL:
            <br />
            <cite>
              Commission Nationale de l'Informatique et des Libertés
              <br />
              3 Place de Fontenoy
              <br />
              75007 PARIS.
              <br />
            </cite>
          </p>
          <h2>Cookies déposés et opt-out</h2>
          <p>
            Ce site dépose un petit fichier texte (un « cookie ») sur votre ordinateur lorsque vous le consultez. Cela nous permet
            de mesurer le nombre de visites et de comprendre quelles sont les pages les plus consultées.
          </p>

          <iframe
            className="optout"
            src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=#212529&fontSize=16px&fontFamily=Source%20Sans%20Pro"
          />
          <p>
            Pour plus d'information sur la gestion des cookies dans Signal Conso, consultez la rubrique{' '}
            <Link href={siteMap.cookies}>Gestion des cookies</Link>
          </p>
        </PanelBody>
      </Panel>
    </Page>
  )
}

export default SuiviEtViePrivee
