import {CompanyByWebsite} from './CompanyByWebsite'
import {CompanyDraft, CompanyKinds, CompanySearchResult, ReportDraft} from '@signal-conso/signalconso-api-sdk-js'
import {useReportFlowContext} from '../ReportFlowContext'
import React, {Dispatch, SetStateAction, useState} from 'react'
import {CompanyIdentifyBy, IdentifyBy} from './CompanyIdentifyBy'
import {useI18n} from '../../../core/i18n'
import {CompanyByNameAndPostalCode} from './CompanyByNameAndPostalCode'
import {CompanySearchResultComponent} from './CompanySearchResult'
import {CompanyAskIsForeign, IsForeignCompany} from './CompanyAskIsForeign'
import {CompanySearchByIdentity} from './CompanySearchByIdentity'
import {ScButton} from '../../../shared/Button/Button'
import {CompanyAskConsumerPostalCode} from './CompanyAskConsumerPostalCode'
import {CompanyAskForeignDetails} from './CompanyAskForeignDetails'
import {CompanyAskConsumerStreet} from './CompanyAskConsumerStreet'
import {TreeStepper, TreeStepperNode} from '../../../shared/TreeStepper/TreeStepper'
import {StepperActions} from '../../../shared/Stepper/StepperActions'
import {AnimateProps} from '../../../shared/Animate/Animate'

interface CompanyProps {
  animatePanel?: boolean
  autoScrollToPanel?: boolean
}

interface CompanyWithRequiredPropsProps extends CompanyProps {
  draft: Partial<ReportDraft>
  // companyKind: CompanyKinds
  onUpdateReportDraft: Dispatch<SetStateAction<Readonly<Partial<ReportDraft>>>>
}

export const Company = ({animatePanel, autoScrollToPanel}: CompanyProps) => {
  const _reportFlow = useReportFlowContext()
  const draft = _reportFlow.reportDraft
  const {m} = useI18n()
  if (draft.companyDraft) {
    return (
      <>
        {JSON.stringify(draft.companyDraft)}
        <ScButton onClick={() => _reportFlow.setReportDraft(_ => ({..._, companyDraft: undefined}))}>{m.edit}</ScButton>
      </>
    )
  }
  return (
    <>
      <CompanyWithRequiredProps
        animatePanel={animatePanel}
        autoScrollToPanel={autoScrollToPanel}
        draft={draft}
        // companyKind={draft.companyKind}
        onUpdateReportDraft={_reportFlow.setReportDraft}
      />
    </>
  )
}
const autoScroll = true

const CompanyWithRequiredProps = ({
  autoScrollToPanel,
  animatePanel,
  draft,
  // companyKind,
  onUpdateReportDraft,
}: CompanyWithRequiredPropsProps) => {
  const animate: Partial<AnimateProps> = {autoScrollTo: autoScrollToPanel, animate: animatePanel}
  const [companyDraft, setCompanyDraft] = useState<Partial<CompanyDraft>>({})
  const [result, setResult] = useState<CompanySearchResult[] | undefined>()
  const [resultFromMatch, setResultFromMatch] = useState<CompanySearchResult[] | undefined>()
  const [identifyBy, setIdentifyBy] = useState<IdentifyBy | undefined>()
  const [isForeign, setIsForeign] = useState<IsForeignCompany | undefined>()
  const {m} = useI18n()

  const renderWebsite = () => (
    <CompanyByWebsite {...animate} value={companyDraft?.website} onSubmit={(website, _result) => {
      setCompanyDraft(_ => ({..._, website}))
      setResultFromMatch(_result)
    }}/>
  )

  const renderSearchResult = () => (
    <CompanySearchResultComponent {...animate} companies={result!} onChange={result => {
      setCompanyDraft(_ => ({..._, ...result}))
    }}/>
  )

  const renderIdentifyBy = () => (
    <CompanyIdentifyBy {...animate} companyKind={draft.companyKind!} value={identifyBy} onChange={setIdentifyBy}/>
  )

  const renderAskNameAndPostalCode = () => (
    <CompanyByNameAndPostalCode
      autoScrollTo={autoScroll}
      onFound={setResult}
      onReportForeignCompany={() => {
        setIdentifyBy(IdentifyBy.NONE)
      }}
    />
  )

  const renderSearchByIdentity = () => (
    <CompanySearchByIdentity {...animate} onFound={setResult}/>
  )

  const renderAskIsForeign = () => (
    <CompanyAskIsForeign {...animate} onChange={setIsForeign}/>
  )

  const renderAskConsumerPostalCode = () => (
    <CompanyAskConsumerPostalCode {...animate} onChange={postalCode => setCompanyDraft(_ => ({..._, address: {..._.address, postalCode}}))}/>
  )

  const renderAskForeignDetails = () => (
    <CompanyAskForeignDetails {...animate} onChange={form => {
      setCompanyDraft(_ => ({
        ..._,
        name: form?.name,
        address: {..._.address, country: form?.country, postalCode: form?.postalCode}
      }))
    }}/>
  )

  const renderAskConsumerStreet = () => (
    <CompanyAskConsumerStreet {...animate} onChange={form => {
      setCompanyDraft(_ => ({
        ..._,
        address: {..._, street: form.street, postalCode: form.postalCode}
      }))
    }}/>
  )

  const commonTree: TreeStepperNode = {
    id: 'companyIdentifyBy',
    done: !!identifyBy,
    render: renderIdentifyBy,
    children: [
      {
        id: 'companyByNameAndPostalCode',
        if: identifyBy === IdentifyBy.NAME,
        done: !!result,
        render: renderAskNameAndPostalCode,
        children: [{
          id: 'searchResult',
          done: !!companyDraft.siret,
          render: renderSearchResult
        }]
      },
      {
        id: 'companyByIdentity',
        if: identifyBy === IdentifyBy.IDENTITY,
        done: !!result,
        render: renderSearchByIdentity,
        children: [{
          id: 'searchResult',
          done: !!companyDraft.siret,
          render: renderSearchResult
        }]
      },
      {
        id: 'askConsumerStreet',
        if: identifyBy === IdentifyBy.NONE && draft.companyKind === CompanyKinds.LOCATION,
        done: !!(companyDraft.address?.street && companyDraft.address?.postalCode),
        render: renderAskConsumerStreet,
      },
      {
        id: 'companyByNone',
        render: renderAskIsForeign,
        done: !!isForeign,
        children: [
          {
            id: 'companyAskConsumerPostalCode',
            if: isForeign === IsForeignCompany.Yes,
            render: renderAskConsumerPostalCode,
          },
          {
            id: 'companyAskForeignDetails',
            if: isForeign === IsForeignCompany.No,
            render: renderAskForeignDetails,
          },
          {
            id: 'companyAskConsumerPostalCode',
            if: isForeign === IsForeignCompany.Unknown,
            render: renderAskConsumerPostalCode,
          }
        ]
      },
    ]
  }

  return (
    <>
      <TreeStepper
        tree={[
          {
            id: 'website',
            if: draft.companyKind === CompanyKinds.WEBSITE,
            done: !!companyDraft.website,
            render: renderWebsite,
            children: [
              {
                id: 'searchResult',
                if: !!resultFromMatch,
                done: !!companyDraft.siret,
                render: renderSearchResult
              },
              commonTree
            ],
          },
          {
            id: 'phone',
            if: draft.companyKind === CompanyKinds.PHONE,
            done: !!companyDraft.phone,
            render: renderWebsite,
            children: [
              {
                id: 'searchResult',
                if: !!resultFromMatch,
                done: !!companyDraft.siret,
                render: renderSearchResult
              },
              commonTree
            ],
          },
          commonTree
        ]}
        renderDone={
          <StepperActions next={next => {
            onUpdateReportDraft(_ => ({..._, companyDraft: companyDraft as CompanyDraft}))
            next()
          }}/>
        }/>
    </>
  )
}
