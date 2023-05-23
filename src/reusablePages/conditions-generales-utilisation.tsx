import {Page} from 'components_simple/Page/Page'
import {useState} from 'react'
import {fnSwitch} from '../utils/FnSwitch'
import Head from 'next/head'
import {pageDefinitions} from 'core/pageDefinition'
import {ContentPageContainer} from 'components_simple/ContentPageContainer'
import {Tabs} from '@codegouvfr/react-dsfr/Tabs'

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const ConditionsGeneralesUtilisation = () => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <>
      <Head>
        <title>{pageDefinitions.conditionsGeneralesUtilisation.title}</title>
        <meta name="description" content={pageDefinitions.conditionsGeneralesUtilisation.description} />
      </Head>
      <ContentPageContainer>
        <h1>Conditions générales d'utilisation de l'interface en ligne SignalConso</h1>
        <Tabs
          tabs={[
            {label: 'Consommateur', iconId: 'fr-icon-user-line', content: <ConditionsGeneralesUtilisationConso />},
            {label: 'Professionnel', iconId: 'fr-icon-briefcase-line', content: <ConditionsGeneralesUtilisationPro />},
          ]}
        />
      </ContentPageContainer>
    </>
  )
}

function ConditionsGeneralesUtilisationConso() {
  return (
    <div>
      <p>
        Les conditions générales d'utilisation doivent être acceptées par l’utilisateur de l'interface en ligne (tout logiciel ou
        application, y compris un site internet, une section de site internet ou une application mobile).
      </p>
      <h2 className="fr-h4">À quoi sert l'interface en ligne SignalConso ?</h2>
      <p>
        L'interface en ligne permet aux consommateurs de connaître la réglementation et de déposer un signalement.
        <br />
        Il ne doit en aucun cas s'agir d'une urgence nécessitant l'intervention des services de secours.{' '}
        <b>Dans ce cas, il faut appeler le « 112 ».</b>
      </p>
      <h2 className="fr-h4">Ce service est-il payant ?</h2>
      <p>L'interface en ligne est accessible gratuitement à tout utilisateur ayant un accès à internet.</p>
      <h2 className="fr-h4">Que peut-on signaler ?</h2>
      <p>
        L’utilisateur peut signaler des manquements relatifs au Code de la Consommation (principalement) et des litiges
        contractuels constatés chez une entreprise. Il n’est pas possible de signaler un litige avec un particulier.
      </p>
      <h2 className="fr-h4">Qui traite les signalements ?</h2>
      <p>
        Les signalements sont traités par l’équipe SignalConso qui vérifie que le signalement rentre bien dans le périmètre de
        l'interface en ligne et que les données reçues ne sont pas “sensibles”.
      </p>
      Les signalements sont ensuite visibles :
      <ul>
        <li>par le professionnel, dont l’entreprise a été mise en cause,</li>
        <li>par les agents de la DGCCRF, qui sont habilités à faire des enquêtes.</li>
      </ul>
      <h2 className="fr-h4">Les signalements sont-ils anonymes ?</h2>
      <p>
        L’utilisateur doit s’identifier auprès de l’administration (SignalConso et DGCCRF) en donnant son nom, son prénom et son
        adresse email.
        <br />
        Par contre, l'utilisateur a la possibilité de rester anonyme vis-à-vis de l'entreprise.
      </p>
      <h2 className="fr-h4">Existe-t-il un suivi de dossier ?</h2>
      <p>SignalConso ne propose pas de suivi personnalisé des dossiers. Les signalements sont traités de manière collective.</p>
      <h2 className="fr-h4">Quel est le risque en cas de dénonciation mensongère ?</h2>
      <p>
        L’article 226-10 du Code Pénal dispose que "la dénonciation, effectuée par tout moyen et dirigée contre une personne
        déterminée, d'un fait qui est de nature à entraîner des sanctions judiciaires, administratives ou disciplinaires et que
        l'on sait totalement ou partiellement inexact, lorsqu'elle est adressée soit à un officier de justice ou de police
        administrative ou judiciaire, soit à une autorité ayant le pouvoir d'y donner suite ou de saisir l'autorité compétente,
        soit aux supérieurs hiérarchiques ou à l'employeur de la personne dénoncée, est punie de cinq ans d'emprisonnement et de
        45 000 € d'amende."
        <br />
        Le détournement de l'interface en ligne de signalement pour effectuer des dénonciations mensongères fera l'objet de
        poursuites judiciaires.
      </p>
      <h2 className="fr-h4"> Traitement des signalements abusifs ou frauduleux</h2>
      <p>
        Les droit de saisine par voie électronique ne s’applique pas aux envois abusifs, notamment par leur nombre, leur caractère
        répétitif ou systématique, ou les envois susceptibles de porter atteinte à la sécurité des systèmes d’information ou
        pouvant porter atteinte au personne physique ou morale (menace de mort, insulte, ...). Dans ces conditions les
        signalements répétés susceptibles de perturber le bon fonctionnement du service ou qui auraient pour effet de faire peser
        sur lui une charge disproportionnée au regard des moyens dont il dispose pourrait voir leurs adresses bloquées.
      </p>
      <h2 className="fr-h4">Mentions légales</h2>
      <p>
        L'édition de l'interface en ligne https://signal.conso.gouv.fr est assurée par la Direction générale de la Concurrence, de
        la Consommation et de la Répression des fraudes (DGCCRF), située au 59 Boulevard Vincent Auriol 75013 Paris.
        <br />
        L'hébergeur de l'interface en ligne https://signal.conso.gouv.fr est la société Clever Cloud dont le siège social est
        situé 3 rue de l’Allier 44000 Nantes.
      </p>
      <h2 className="fr-h4">Propriété intellectuelle</h2>
      <p>
        Les marques, logos, signes et tout autre contenu de l'interface en ligne font l'objet d'une protection par le Code de la
        propriété intellectuelle et plus particulièrement par le droit d'auteur.
      </p>
    </div>
  )
}

function ConditionsGeneralesUtilisationPro() {
  return (
    <div>
      <p>
        Les conditions générales d'utilisation doivent être acceptées par le professionnel afin d’utiliser l'interface en ligne
        SignalConso.
      </p>

      <h2 className="fr-h4">Gratuité de la plate-forme SignalConso</h2>
      <p>
        L'interface en ligne est accessible gratuitement aux professionnels.
        <br />
        Si vous recevez une sollicitation vous réclamant une somme d’argent dans le cadre de SignalConso, refusez la proposition
        et alertez rapidement la DIRECCTE ou la DDPP de votre secteur.
        <br />
        Coordonnées disponibles ici:&nbsp;
        <a
          href="https://www.economie.gouv.fr/dgccrf/coordonnees-des-DDPP-et-DDCSPP"
          target="_blank"
          rel="noreferrer"
          title="coordonnées des DDPP et DDCSPP (nouvelle fenêtre)"
        >
          https://www.economie.gouv.fr/dgccrf/coordonnees-des-DDPP-et-DDCSPP
        </a>
      </p>

      <h2 className="fr-h4">Objections quant au signalement déposé</h2>
      <p>
        Si vous contestez le signalement qui a été déposé, vous pouvez le notifier directement dans votre espace professionnel.
        <br /> Votre réponse sera transmise au consommateur et à la DGCCRF. Un second espace de réponse permet d'apporter des
        éléments à la connaissance de la DGCCRF seulement. Vous pouvez y joindre des pièces jointes.
        <br /> <b>Pour rappel, ce sont les constatations effectuées par les enquêteurs lors d’un contrôle qui font foi.</b>
      </p>

      <h2 className="fr-h4">Prise de contact avec le consommateur</h2>
      <p>
        Si le consommateur a souhaité vous transférer ses coordonnées, vous pouvez le contacter. Ce contact doit être courtois et
        être fait uniquement dans le cadre du signalement. Il a notamment pour but de récupérer des informations manquantes et
        traiter si besoin le litige.
        <br />
        <b>
          {' '}
          Il est interdit d’utiliser les coordonnées du consommateur à des fins de prospections commerciales.
          <br />
          Il est interdit d’intimider ou de harceler le consommateur afin de lui faire retirer son signalement.
        </b>
        <br />
        Tout abus pourra entraîner des poursuites judiciaires.
      </p>

      <h2 className="fr-h4">Dénonciation mensongère</h2>
      <p>
        L’article 226-10 du Code Pénal dispose que "la dénonciation, effectuée par tout moyen et dirigée contre une personne
        déterminée, d'un fait qui est de nature à entraîner des sanctions judiciaires, administratives ou disciplinaires et que
        l'on sait totalement ou partiellement inexact, lorsqu'elle est adressée soit à un officier de justice ou de police
        administrative ou judiciaire, soit à une autorité ayant le pouvoir d'y donner suite ou de saisir l'autorité compétente,
        soit aux supérieurs hiérarchiques ou à l'employeur de la personne dénoncée, est punie de cinq ans d'emprisonnement et de
        45 000 € d'amende."
        <br />
        <b>
          Le détournement de l'interface en ligne de signalement pour effectuer des dénonciations mensongères fera l'objet de
          poursuites judiciaires.
        </b>
      </p>

      <h2 className="fr-h4">Mentions légales</h2>
      <p>
        L'édition de l'interface en ligne https://signal.conso.gouv.fr est assurée par la Direction générale de la Concurrence, de
        la Consommation et de la Répression des fraudes (DGCCRF), située au 59 Boulevard Vincent Auriol 75013 Paris.
        <br />
        L'hébergeur de l'interface en ligne https://signal.conso.gouv.fr est la société Clever Cloud dont le siège social est
        situé 3 rue de l’Allier 44000 Nantes.
      </p>

      <h2 className="fr-h4">Propriété intellectuelle</h2>
      <p>
        Les marques, logos, signes et tout autre contenu de l'interface en ligne font l'objet d'une protection par le Code de la
        propriété intellectuelle et plus particulièrement par le droit d'auteur.
      </p>
    </div>
  )
}
