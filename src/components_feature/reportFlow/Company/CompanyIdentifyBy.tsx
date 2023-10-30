import React, {ReactNode, useState} from 'react'
import {useI18n} from 'i18n/I18n'
import {Animate} from 'components_simple/Animate'
import {CompanyKinds} from '../../../anomalies/Anomaly'
import {ScRadioButtons} from '../../../components_simple/formInputs/ScRadioButtons'

export enum IdentifyBy {
  BARCODE = 'BARCODE',
  NAME = 'NAME',
  IDENTITY = 'IDENTITY',
  NONE = 'NONE',
}

interface Props {
  companyKind: CompanyKinds
  children: (identifyBy: IdentifyBy) => ReactNode
}

export const CompanyIdentifyBy = ({companyKind, children}: Props) => {
  const {m} = useI18n()
  const [identifyBy, setIdentifyBy] = useState<IdentifyBy | undefined>()

  const createOptions = (companyKind: CompanyKinds) => [
    ...(companyKind === 'PRODUCT'
      ? [
          {
            label: m.identifyBy_barcode,
            description: m.identifyBy_barcodeDesc,
            value: IdentifyBy.BARCODE,
          },
        ]
      : []),
    {label: m.identifyBy_name, description: m.identifyBy_nameDesc, value: IdentifyBy.NAME},
    {label: m.identifyBy_identity, description: m.identifyBy_identityDesc, value: IdentifyBy.IDENTITY},
    ...(companyKind !== 'SIRET'
      ? [
          {
            label: m.identifyBy_none,
            description: m.identifyBy_noneDesc,
            value: IdentifyBy.NONE,
          },
        ]
      : []),
  ]

  return (
    <>
      <Animate>
        <div id="CompanyIdentifyBy">
          <ScRadioButtons
            required
            value={identifyBy}
            onChange={setIdentifyBy}
            options={createOptions(companyKind)}
            title={m.canYouIdentifyCompany}
            titleNoAutoAsterisk
            description={m.canYouIdentifyCompanyDesc}
          />
        </div>
      </Animate>
      {identifyBy && children(identifyBy)}
    </>
  )
}
