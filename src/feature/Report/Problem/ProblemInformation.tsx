import {Information, Subcategory} from '@signal-conso/signalconso-api-sdk-js'
import {Animate} from 'shared/Animate/Animate'
import {Panel, PanelBody} from 'shared/Panel/Panel'
import {useI18n} from 'core/i18n'
import {Fender, Txt} from 'mui-extension'
import {IconBtn} from 'mui-extension/lib'
import {Icon} from '@mui/material'
import {useApiSdk} from 'core/context/ApiSdk'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {ScButton} from 'shared/Button/Button'
import Link from 'next/link'
import {siteMap} from 'core/siteMap'
import {mapPromise} from '@alexandreannic/ts-utils/lib/index'
import {useEffect, useState} from 'react'
import {AccordionInline} from 'shared/AccordionInline/AccordionInline'
import {useAnalyticContext} from '../../../core/analytic/AnalyticContext'
import {EventCategories, ReportEventActions} from '../../../core/analytic/analytic'
import {last} from '../../../core/lodashNamedExport'

interface Props {
  category: string
  subcategories: Subcategory[]
  information: Information
  animate?: boolean
  autoScrollTo?: boolean
}

export const ProblemInformation = ({
  category,
  subcategories,
  information,
  animate,
  autoScrollTo,
}: Props) => {
  const _analytic = useAnalyticContext()
  const {m} = useI18n()
  const {apiSdk} = useApiSdk()
  const [votedPositive, setVotedPositive] = useState<boolean | undefined>()
  useEffect(() => {
    _analytic.trackEvent(EventCategories.report, ReportEventActions.outOfBounds, subcategories && subcategories.length > 0 ? last(subcategories)?.title : category)
  }, [category, subcategories, information])
  const _vote = useFetcher(
    mapPromise({
      promise: apiSdk.rating.rate,
      mapThen: () => ({rated: true})
    })
  )
  const vote = (positive: boolean) => {
    setVotedPositive(positive)
    _vote.fetch({}, category, subcategories, positive)
  }

  return (
    <>
      <Animate animate={animate} autoScrollTo={autoScrollTo}>
        <Panel id="test-info" title={m.informationTitle} border>
          <PanelBody className="blog">
            {information.outOfScope && (
              <Txt block gutterBottom>{m.informationReportOutOfScope}</Txt>
            )}
            {information.title && (
              <Txt gutterBottom block dangerouslySetInnerHTML={{__html: information.title}}/>
            )}
            {information.content && (
              <Txt gutterBottom block dangerouslySetInnerHTML={{__html: information.content}}/>
            )}
            {information.actions?.map(action => (
              <AccordionInline sx={{mt: 1}} key={action.question} label={
                <div>
                  <Txt bold block dangerouslySetInnerHTML={{__html: action.question}}/>
                  {action.example && <Txt block dangerouslySetInnerHTML={{__html: action.example}}/>}
                </div>
              }>
                <Txt color="hint">{action.answer}</Txt>
              </AccordionInline>
            ))}
          </PanelBody>
        </Panel>
      </Animate>
      <Animate animate={animate} autoScrollTo={autoScrollTo}>
        <Panel title={m.informationWasUsefull} border>
          {_vote.entity ? (
            <PanelBody>
              <Fender type="success" iconSize={80}>{m.informationRatingSaved}</Fender>
            </PanelBody>
          ) : (
            <PanelBody sx={{display: 'flex', justifyContent: 'center'}}>
              <IconBtn
                loading={_vote.loading && votedPositive === true}
                disabled={_vote.loading && votedPositive === false}
                size="large"
                color="primary"
                onClick={() => vote(true)}
                sx={{mr: 4}}
              >
                <Icon style={{fontSize: 38}}>thumb_up</Icon>
              </IconBtn>
              <IconBtn
                loading={_vote.loading && votedPositive === false}
                disabled={_vote.loading && votedPositive === true}
                size="large"
                color="primary"
                onClick={() => vote(false)}
              >
                <Icon style={{fontSize: 38}}>thumb_down</Icon>
              </IconBtn>
            </PanelBody>
          )}
        </Panel>
      </Animate>
      <Link href={siteMap.index}>
        <ScButton icon="home" variant="contained" sx={{
          display: 'block',
          margin: 'auto',
          mt: 3
        }}>{m.backToHome}</ScButton>
      </Link>
    </>
  )
}
