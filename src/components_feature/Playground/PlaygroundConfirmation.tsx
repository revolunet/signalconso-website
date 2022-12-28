import {useTheme} from '@mui/material'
import {allAnomalies} from 'anomalies/Anomalies'
import {ReportStep} from 'model/ReportStep'
import {styleUtils} from 'core/theme'
import {useEffect, useState} from 'react'
import {Anomaly} from '../../anomalies/Anomaly'
import {ReportDraft} from '../../model/ReportDraft'
import {Fixture} from '../../test/fixture'
import {_Confirmation} from '../Report/Confirmation/Confirmation'

export const PlaygroundConfirmation = () => {
  const [draft, setDraft] = useState<ReportDraft>(Fixture.genDraftReport('Confirmation') as ReportDraft)
  const [anomaly, setAnomaly] = useState<Anomaly | undefined>()
  const theme = useTheme()
  useEffect(() => {
    setAnomaly(allAnomalies.find(_ => _.category === draft.category)!)
  }, [])
  return (
    <>
      <div>
        <b>{anomaly?.category}</b>
      </div>
      <pre style={{fontSize: styleUtils(theme).fontSize.small, lineHeight: 1.3}}>{JSON.stringify(draft, undefined, 2)}</pre>
      {anomaly && (
        <_Confirmation
          anomaly={anomaly}
          draft={{
            ...draft,
          }}
        />
      )}
    </>
  )
}
