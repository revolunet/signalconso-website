import React from 'react'
import {ScRadioGroup, ScRadioGroupItem} from '../../../shared/RadioGroup'
import {useI18n} from '../../../core/i18n'
import {BoxProps} from '@mui/material'
import {Txt} from 'mui-extension'
import {Panel, PanelBody} from '../../../shared/Panel/Panel'
import {CompanyKinds} from '@signal-conso/signalconso-api-sdk-js'
import {Animate} from '../../../shared/Animate/Animate'

export enum IdentifyBy {
  NAME = 'NAME',
  IDENTITY = 'IDENTITY',
  NONE = 'NONE',
}

interface Props extends Omit<BoxProps, 'onChange' | 'defaultValue'> {
  autoScrollTo?: boolean
animate?: boolean
  companyKind: CompanyKinds
  onChange: (identifyBy: IdentifyBy) => void
  value?: IdentifyBy
}

export const CompanyIdentifyBy = ({autoScrollTo, animate, companyKind, value, onChange, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <Animate autoScrollTo={autoScrollTo} animate={animate}>
      <Panel title={m.canYouIdentifyCompany}>
        <Txt block sx={{mb: 2}} color="hint">{m.canYouIdentifyCompanyDesc}</Txt>
        <PanelBody>
          <ScRadioGroup {...props} value={value} onChange={onChange}>
            {companyKind !== CompanyKinds.INFLUENCEUR && (
              <ScRadioGroupItem value={IdentifyBy.NAME} title={m.identifyBy_name}/>
            )}
            <ScRadioGroupItem value={IdentifyBy.IDENTITY} title={m.identifyBy_identity}/>
            {companyKind !== CompanyKinds.SIRET && (
              <ScRadioGroupItem value={IdentifyBy.NONE} title={m.identifyBy_none}/>
            )}
          </ScRadioGroup>
        </PanelBody>
      </Panel>
    </Animate>
  )
}
