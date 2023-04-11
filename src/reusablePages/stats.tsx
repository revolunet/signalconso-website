import {Stat} from 'components_feature/Stat/Stat'
import {StaticContentPage} from 'components_simple/HelpPageLayout'
import {useApiClients} from 'context/ApiClientsContext'
import {pageDefinitions} from 'core/pageDefinition'
import {useI18n} from 'i18n/I18n'
import Head from 'next/head'
import Link from 'next/link'

const Stats = () => {
  const apiClient = useApiClients().signalConsoApiClient
  const {m} = useI18n()

  return (
    <>
      <Head>
        <title>{pageDefinitions.stats.title}</title>
        <meta name="description" content={pageDefinitions.stats.description} />
      </Head>
      <StaticContentPage>
        <h1 className="">Statistiques</h1>
        <p>
          Ces statistiques sont mises à jour en temps réel. Des statistiques complémentaires sont aussi disponibles sur le site{' '}
          <Link className="" target="_blank" rel="noreferrer" href="https://data.economie.gouv.fr/pages/signalconso/">
            data.economie.fr
          </Link>
        </p>
        <div className="space-y-4">
          <Stat
            title={m.acceptedReportStat}
            name={m.acceptedReportStatName}
            count={() => apiClient.getPublicStatCount('PromesseAction')}
            curve={() => apiClient.getPublicStatCurve('PromesseAction')}
          />
          <Stat
            title={m.reportsCountStat}
            name={m.reportsCountStatName}
            count={() => apiClient.getPublicStatCount('Reports')}
            curve={() => apiClient.getPublicStatCurve('Reports')}
          />
          <Stat
            title={m.transmittedRateStat}
            name={m.transmittedRateStatName}
            description={m.transmittedRateDescription}
            count={() => apiClient.getPublicStatCount('TransmittedPercentage')}
            curve={() => apiClient.getPublicStatCurve('TransmittedPercentage')}
            percentage
          />
          <Stat
            title={m.readRateStat}
            name={m.readRateStatName}
            description={m.readRateDescription}
            count={() => apiClient.getPublicStatCount('ReadPercentage')}
            curve={() => apiClient.getPublicStatCurve('ReadPercentage')}
            percentage
          />
          <Stat
            title={m.respondedRateStat}
            name={m.respondedRateStatName}
            description={m.respondedRateDescription}
            count={() => apiClient.getPublicStatCount('ResponsePercentage')}
            curve={() => apiClient.getPublicStatCurve('ResponsePercentage')}
            percentage
          />
          <Stat
            title={m.websiteReportsRateStat}
            name={m.respondedRateStatName}
            count={() => apiClient.getPublicStatCount('WebsitePercentage')}
            percentage
          />
        </div>
      </StaticContentPage>
    </>
  )
}

export default Stats
