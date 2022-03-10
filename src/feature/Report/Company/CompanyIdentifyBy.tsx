import React, {ReactNode, useState} from 'react'
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
  companyKind: CompanyKinds
  children: (identifyBy: IdentifyBy) => ReactNode
  value?: IdentifyBy
}

export const CompanyIdentifyBy = ({companyKind, value, children, ...props}: Props) => {
  const {m} = useI18n()
  const [identifyBy, setIdentifyBy] = useState<IdentifyBy | undefined>()
  return (
    <>
      <Animate>
        <Panel title={m.canYouIdentifyCompany} id="CompanyIdentifyBy">
          <Txt block sx={{mb: 2}} color="hint">{m.canYouIdentifyCompanyDesc}</Txt>
          <PanelBody>
            <ScRadioGroup value={value} onChange={setIdentifyBy}>
              {companyKind !== CompanyKinds.INFLUENCEUR && (
                <ScRadioGroupItem value={IdentifyBy.NAME} title={m.identifyBy_name}/>
              )}
              <ScRadioGroupItem value={IdentifyBy.IDENTITY} title={m.identifyBy_identity}/>
              {companyKind !== CompanyKinds.SIRET && (
                <ScRadioGroupItem
                  value={IdentifyBy.NONE}
                  title={m.identifyBy_none}
                  description={m.companyIdentifyByNoneDesc}/>
              )}
            </ScRadioGroup>
          </PanelBody>
        </Panel>
      </Animate>
      {identifyBy && children(identifyBy)}
    </>
  )
}
