import React, {useMemo} from 'react'
import {config} from '../../../conf/config'
import {Category, CompanyKinds, ReportTag, Subcategory} from '@signal-conso/signalconso-api-sdk-js'
import {messages} from '../../../conf/messages'
import {ScButton} from '../../../shared/Button/Button'
import {useStepperContext} from '../../../shared/Stepper/Stepper'
import {useReportFlowContext} from '../ReportFlowContext'
import {useSelectedSubcategoriesUtils} from './useSelectedSubcategoriesUtils'
import {ProblemStep, ProblemStepper} from './ProblemStepper'
import {ProblemSelect} from './ProblemSelect'

interface Props {
  anomaly: Category
  m: typeof messages
}

export const Problem = ({anomaly, m}: Props) => {
  const displayReponseConso = useMemo(() => Math.random() * 100 < config.reponseConsoDisplayRate, [])

  const _reportFlow = useReportFlowContext()
  const draft = _reportFlow.reportDraft
  const _stepper = useStepperContext()

  const {
    tagsFromSelected,
    lastSubcategories,
    isLastSubcategory,
    showEmployeeConsumer,
    companyKindFromSelected,
  } = useSelectedSubcategoriesUtils(anomaly, draft.subcategories ?? [])

  const submit = () => {
    _reportFlow.setReportDraft(_ => ({
      ..._,
      tags: tagsFromSelected,
      companyKind: _.companyKind ?? companyKindFromSelected ?? CompanyKinds.SIRET,
    }))
    _stepper.next()
  }

  const handleSubcategoriesChange = (subcategory: Subcategory | undefined, index: number) => {
    _reportFlow.setReportDraft(report => {
      const copy = {...report}
      copy.subcategories = report.subcategories ?? []
      copy.subcategories.length = index
      copy.subcategories[index] = subcategory!
      copy.subcategories = [...copy.subcategories]
      return copy
    })
  }

  return (
    <>
      {([anomaly, ...(draft.subcategories ?? [])]).map((c, i) => c.subcategories && (
        <ProblemSelect
          key={c.id}
          title={anomaly.subcategoriesTitle}
          value={draft.subcategories?.[i]?.id}
          onChange={title => handleSubcategoriesChange(c.subcategories?.find(_ => _.title === title), i)}
          options={(c.subcategories ?? []).map((_, i) => ({
            title: _.title,
            description: _.example,
            value: _.id
          }))}
        />
      ))}
      {isLastSubcategory && (
        <ProblemStepper renderDone={
          <ScButton color="primary" variant="contained" onClick={submit}>{m.next}</ScButton>
        }>
          <ProblemStep isDone={draft.companyKind !== undefined} hidden={!!companyKindFromSelected}>
            <ProblemSelect
              title="Est-ce que votre problème concerne une entreprise sur internet ?"
              value={draft.companyKind}
              onChange={companyKind => _reportFlow.setReportDraft(_ => ({..._, companyKind}))}
              options={[
                {
                  title: 'Oui',
                  value: CompanyKinds.WEBSITE
                }, {
                  title: `Non, pas sur internet`,
                  value: tagsFromSelected.indexOf(ReportTag.ProduitDangereux) === -1 ? CompanyKinds.SIRET : CompanyKinds.LOCATION
                }
              ]}
            />
          </ProblemStep>
          <ProblemStep isDone={draft.employeeConsumer !== undefined} hidden={!showEmployeeConsumer}>
            <ProblemSelect
              title="Travaillez-vous dans l'entreprise que vous souhaitez signaler ?"
              value={draft.employeeConsumer}
              onChange={employeeConsumer => _reportFlow.setReportDraft(_ => ({..._, employeeConsumer}))}
              options={[
                {
                  title: 'Oui',
                  value: true
                }, {
                  title: `Non, je n'y travaille pas`,
                  value: false
                }
              ]}
            />
          </ProblemStep>
          <ProblemStep
            isDone={draft.contractualDispute !== undefined || draft.forwardToReponseConso !== undefined}
            hidden={draft.employeeConsumer === true}
          >
            <ProblemSelect
              title="Que souhaitez-vous faire ?"
              value={(() => {
                if (draft.contractualDispute === true) return 1
                if (draft.contractualDispute === false) return 2
                if (draft.forwardToReponseConso === true) return 3
              })()}
              options={[
                {
                  title: `Je veux résoudre mon problème personnel avec l'entreprise`,
                  description: 'La répression des fraudes sera informée',
                  value: 1
                },
                {
                  title: `Je souhaite signaler un problème pour que l'entreprise s'améliore`,
                  value: 2
                },
                ...(displayReponseConso ? [{
                  title: `Je souhaite que la répression des fraudes m'informe sur mes droits`,
                  value: 3
                }] : [])
              ]}
              onChange={(value: number) => {
                switch (value) {
                  case 1: {
                    _reportFlow.setReportDraft(_ => ({..._, forwardToReponseConso: undefined, contractualDispute: true}))
                    break
                  }
                  case 2: {
                    _reportFlow.setReportDraft(_ => ({..._, forwardToReponseConso: undefined, contractualDispute: false}))
                    break
                  }
                  case 3: {
                    _reportFlow.setReportDraft(_ => ({..._, forwardToReponseConso: true, contractualDispute: undefined}))
                    break
                  }
                }
              }}
            />
          </ProblemStep>
        </ProblemStepper>
      )}
    </>
  )
}
