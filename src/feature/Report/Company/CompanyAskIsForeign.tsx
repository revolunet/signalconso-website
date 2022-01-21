import {Panel, PanelBody} from '../../../shared/Panel/Panel'
import {useI18n} from '../../../core/i18n'
import {ScRadioGroup, ScRadioGroupItem} from '../../../shared/RadioGroup'
import {Txt} from 'mui-extension'
import {Animate} from '../../../shared/Animate/Animate'

export enum IsForeignCompany {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
}

interface Props {
  autoScrollTo?: boolean
  value?: IsForeignCompany
  onChange: (_: IsForeignCompany) => void
}

export const CompanyAskIsForeign = ({autoScrollTo, value, onChange}: Props) => {
  const {m} = useI18n()
  return (
    <Animate autoScrollTo={autoScrollTo}>
      <Panel title={m.isAFrenchCompany}>
        <PanelBody>
          <ScRadioGroup value={value} onChange={onChange}>
            <ScRadioGroupItem value={IsForeignCompany.Yes} title={m.yes}/>
            <ScRadioGroupItem
              value={IsForeignCompany.No}
              title={m.noItsForeign}
              description={
                <>
                  <Txt color="hint" size="small" dangerouslySetInnerHTML={{__html: m.howToFindCompanyCountryDesc}}/>
                </>
              }
            />
            <ScRadioGroupItem value={IsForeignCompany.Unknown} title={m.iDontKnown}/>
          </ScRadioGroup>
        </PanelBody>
      </Panel>
    </Animate>
  )
}
