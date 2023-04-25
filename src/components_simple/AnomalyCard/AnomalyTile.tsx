import {Tile} from '@codegouvfr/react-dsfr/Tile'
import {Anomaly} from '../../anomalies/Anomaly'
import {useReportFlowContext} from '../../components_feature/Report/ReportFlowContext'

export const AnomalyTile = ({anomaly}: {anomaly: Anomaly}) => {
  const _reportFlow = useReportFlowContext()
  return (
    <Tile
      desc={anomaly.description}
      enlargeLink
      linkProps={{
        href: '/' + anomaly.path,
        onClick: () => {
          // on veut repartir de zéro
          _reportFlow.resetFlow()
        },
        legacyBehavior: false,
      }}
      title={anomaly.title}
      imageUrl={`/image/pictos/${anomaly.img}.png`}
      imageAlt={anomaly.title}
    />
  )
}
