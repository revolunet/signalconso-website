import {Box, Checkbox, Icon, Radio, useTheme} from '@mui/material'
import {pageDefinitions} from 'core/pageDefinition'
import {styleUtils} from 'core/theme'
import {getOptionsFromInput, getPlaceholderFromInput} from 'components_feature/Report/Details/DetailInputsUtils'
import Head from 'next/head'
import {useEffect, useState} from 'react'
import {ScButton} from 'components_simple/Button/Button'
import {Page} from 'components_simple/Page/Page'
import {Txt} from '../alexlibs/mui-extension/Txt/Txt'
import {IconBtn} from '../alexlibs/mui-extension/IconBtn/IconBtn'
import {fnSwitch} from '../utils/FnSwitch'
import {
  allVisibleAnomalies,
  instanceOfAnomaly,
  instanceOfSubcategoryWithInfoWall,
  instanceOfSubcategoryWithInputs,
} from '../anomalies/Anomalies'
import {Anomaly, DetailInputType, Subcategory, SubcategoryWithInfoWall, StandardSubcategory} from '../anomalies/Anomaly'

const Node = ({anomaly, open}: {anomaly: Anomaly | Subcategory; open?: boolean}) => {
  const iconWidth = 40
  const iconMargin = 8
  const theme = useTheme()
  const title = instanceOfAnomaly(anomaly) ? anomaly.category : anomaly.title
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsOpen(!!open)
  }, [open])

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', mb: 2}}>
      <Box
        sx={{
          width: iconWidth,
          marginRight: `${iconMargin}px`,
        }}
      >
        {anomaly.subcategories ? (
          <IconBtn color="primary" onClick={() => setIsOpen(_ => !_)}>
            <Icon>{isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}</Icon>
          </IconBtn>
        ) : (
          <IconBtn disabled>
            <Icon>remove</Icon>
          </IconBtn>
        )}
      </Box>
      <Box>
        <Box sx={{minHeight: 42, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Txt block>
            <span dangerouslySetInnerHTML={{__html: title}} /> <Txt color="hint">{anomaly.id}</Txt>
          </Txt>
          {instanceOfAnomaly(anomaly) && anomaly.description && (
            <Txt block size="small" color="hint" dangerouslySetInnerHTML={{__html: anomaly.description}} />
          )}
          {(anomaly as Subcategory).reponseconsoCode && (
            <Txt key={1} size="small" color="hint">
              <b>ReponseConso codes:</b>&nbsp;
              {(anomaly as Subcategory).reponseconsoCode?.join(', ')}
            </Txt>
          )}
          <Box>
            {(anomaly as Subcategory).tags?.map(tag => (
              <Box
                sx={{
                  mr: 1,
                  borderRadius: 100,
                  height: 26,
                  px: 1.5,
                  backgroundColor: t => t.palette.action.disabledBackground,
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: styleUtils(theme).fontSize.small,
                  // fontWeight: t => t.typography.fontWeightBold,
                  color: t => t.palette.text.secondary,
                }}
                key={tag}
              >
                {tag}
              </Box>
            ))}
          </Box>
          {instanceOfSubcategoryWithInfoWall(anomaly) && <NodeInfo anomaly={anomaly} />}
          {instanceOfSubcategoryWithInputs(anomaly) && <NodeInput anomaly={anomaly} />}
        </Box>
        {isOpen && anomaly.subcategories && (
          <Box
            sx={{
              my: 1,
              position: 'relative',
              '&:before': {
                content: "' '",
                height: '100%',
                width: '1px',
                position: 'absolute',
                background: t => t.palette.divider,
                left: -iconWidth / 2 - iconMargin,
                // borderLeft: t => `1px solid ${t.palette.divider}`
              },
            }}
          >
            {anomaly.subcategories.map(s => (
              <Node open={open} key={s.id} anomaly={s} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

const NodeInput = ({anomaly}: {anomaly: StandardSubcategory}) => {
  return (
    <>
      {anomaly.detailInputs?.map(input => (
        <Box key={input.label}>
          <Txt block sx={{mt: 1}} size="small" color="hint" dangerouslySetInnerHTML={{__html: input.label}} />
          {fnSwitch(
            input.type,
            {
              [DetailInputType.RADIO]: () => (
                <>
                  {getOptionsFromInput(input)!.map(option => (
                    <Box key={option} sx={{display: 'flex', alignItems: 'center'}}>
                      <Radio disabled size="small" sx={{mr: 1, p: 1 / 4}} />
                      <Txt size="small">{option}</Txt>
                    </Box>
                  ))}
                </>
              ),
              [DetailInputType.CHECKBOX]: () => (
                <>
                  {getOptionsFromInput(input)!.map(option => (
                    <Box key={option} sx={{display: 'flex', alignItems: 'center'}}>
                      <Checkbox disabled size="small" sx={{mr: 1, p: 1 / 4}} />
                      <Txt size="small">{option}</Txt>
                    </Box>
                  ))}
                </>
              ),
            },
            () => (
              <Box
                sx={{
                  px: 1,
                  color: t => t.palette.text.disabled,
                  borderRadius: 4,
                  height: 32,
                  width: 200,
                  border: t => `1px solid ${t.palette.divider}`,
                }}
              >
                {getPlaceholderFromInput(input) ?? '...'}
              </Box>
            ),
          )}
        </Box>
      ))}
    </>
  )
}

const NodeInfo = ({anomaly}: {anomaly: SubcategoryWithInfoWall}) => {
  return (
    <>
      {anomaly.blockingInfo.title && <div dangerouslySetInnerHTML={{__html: anomaly.blockingInfo.title}} />}
      {anomaly.blockingInfo.subTitle && <div dangerouslySetInnerHTML={{__html: anomaly.blockingInfo.subTitle}} />}
      {anomaly.blockingInfo.content && (
        <Txt color="hint" size="small" dangerouslySetInnerHTML={{__html: anomaly.blockingInfo.content}} />
      )}
      {anomaly.blockingInfo.questions && (
        <Txt color="hint" size="small">
          <ul>
            {anomaly.blockingInfo.questions.map(action => (
              <li key={action.question}>
                <Txt bold dangerouslySetInnerHTML={{__html: action.question}} />
                {action.desc && <div dangerouslySetInnerHTML={{__html: action.desc}} />}
                <div dangerouslySetInnerHTML={{__html: action.answer}} />
              </li>
            ))}
          </ul>
        </Txt>
      )}
      {anomaly.blockingInfo.notAFraudMessage && (
        <Txt color="hint" size="small">
          Nous ne doutons pas que vous ayez réellement rencontré un problème mais... il ne s’agit pas d’une fraude.
        </Txt>
      )}
    </>
  )
}

const Arborescence = () => {
  const [openAll, setOpenAll] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const anomalies = allVisibleAnomalies()
  return (
    <Page>
      <Head>
        <title>{pageDefinitions.anomaly.title}</title>
        <meta name="description" content={pageDefinitions.anomaly.description} />
      </Head>

      <h1>Arborescence du dépot d'un signalement</h1>

      <ScButton
        loading={disabled}
        color="primary"
        variant="contained"
        icon={openAll ? 'unfold_less' : 'unfold_more'}
        onClick={() => {
          setDisabled(true)
          setTimeout(() => {
            setOpenAll(_ => !_)
          }, 1)
          setTimeout(() => {
            setDisabled(false)
          }, 100)
        }}
        sx={{mb: 2}}
      >
        Tout déplier
      </ScButton>

      {anomalies.map(a => (
        <Node key={a.id} anomaly={a} open={openAll} />
      ))}
    </Page>
  )
}

export default Arborescence
