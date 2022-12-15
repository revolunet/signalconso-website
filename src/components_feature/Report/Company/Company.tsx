import {CompanyByWebsite} from './CompanyByWebsite'
import {useReportFlowContext} from '../ReportFlowContext'
import React from 'react'
import {CompanyIdentifyBy, IdentifyBy} from './CompanyIdentifyBy'
import {useI18n} from 'i18n/I18n'
import {CompanySearchResultComponent} from './CompanySearchResult'
import {CompanyAskIsForeign, IsForeignCompany} from './CompanyAskIsForeign'
import {ScButton} from 'components_simple/Button/Button'
import {ReportDraft2} from 'model/ReportDraft2'
import {useReportFlowStepperContext} from 'components_simple/ReportFlowStepper/ReportFlowStepper'
import {fnSwitch} from '../../../utils/FnSwitch'
import {CompanySearchByNameAndPostalCode} from './CompanySearchByNameAndPostalCode'
import {CompanySearchByIdentity} from './CompanySearchByIdentity'
import {CompanyAskConsumerPostalCode} from './CompanyAskConsumerPostalCode'
import {CompanyAskForeignDetails} from './CompanyAskForeignDetails'
import {DeepPartial} from '../../../utils/utils'
import {CompanyByPhone} from './CompanyByPhone'
import {Txt} from '../../../alexlibs/mui-extension/Txt/Txt'
import {Row} from 'components_simple/Row/Row'
import {AddressComponent} from 'components_simple/Address/Address'
import {Panel, PanelActions, PanelBody} from 'components_simple/Panel/Panel'
import {StepperActionsNext} from 'components_simple/ReportFlowStepper/StepperActionsNext'
import {CompanyAskConsumerStreet} from './CompanyAskConsumerStreet'
import {CompanyWebsiteCountry} from './CompanyWebsiteCountry'
import {useAnalyticContext} from 'analytic/AnalyticContext'
import {EventCategories, ReportEventActions} from 'analytic/analytic'
import {CompanyDraft, ReportDraft} from '../../../model/ReportDraft'
import {CompanySearchResult} from '../../../model/Company'
import {CompanyKinds} from '../../../anomalies/Anomaly'

interface CompanyProps {}

interface CompanyWithRequiredProps extends CompanyProps {
  draft: Pick<ReportDraft, 'companyKind'>
  onUpdateReportDraft: (_: DeepPartial<ReportDraft2>) => void
}

export const Company = ({}: CompanyProps) => {
  const _analytic = useAnalyticContext()
  const _reportFlow = useReportFlowContext()
  const _stepper = useReportFlowStepperContext()
  const draft = _reportFlow.reportDraft
  if (draft.companyDraft) {
    return <CompanyFilled draft={draft} onClear={() => _reportFlow.setReportDraft(_ => ({..._, companyDraft: undefined}))} />
  }
  return (
    <_Company
      draft={draft}
      onUpdateReportDraft={draft => {
        _reportFlow.setReportDraft(_ => ReportDraft2.merge(_, draft))
        _stepper.next()
        _analytic.trackEvent(EventCategories.report, ReportEventActions.validateCompany)
      }}
    />
  )
}

export const CompanyFilled = ({draft, onClear}: {draft: Partial<ReportDraft2>; onClear: () => void}) => {
  const _stepper = useReportFlowStepperContext()
  const {m} = useI18n()
  if (!draft.companyDraft) {
    throw new Error(`companyDraft should be defined ${JSON.stringify(draft)}`)
  }
  return (
    <Panel title={m.companyIdentifiedTitle}>
      <PanelBody>
        <Txt size="big" bold block>
          {draft.companyDraft.name} {draft.companyDraft.brand ?? ''}
        </Txt>

        {draft.companyDraft.siret && (
          <Txt color="hint" block sx={{mb: 2}}>
            <Txt>SIRET:&nbsp;</Txt>
            <Txt bold>{draft.companyDraft.siret}</Txt>
          </Txt>
        )}
        <Row dense icon="location_on">
          <Txt color="hint">
            <AddressComponent address={draft.companyDraft.address} />
          </Txt>
        </Row>
        {draft.companyDraft.website && (
          <Row dense icon="link">
            <Txt color="hint">{draft.companyDraft.website}</Txt>
          </Row>
        )}
        {draft.companyDraft.phone && (
          <Row dense icon="phone">
            <Txt color="hint">{draft.companyDraft.phone}</Txt>
          </Row>
        )}
      </PanelBody>
      <PanelActions>
        <ScButton color="primary" variant="outlined" onClick={onClear} icon="edit">
          {m.edit}
        </ScButton>
        <StepperActionsNext onClick={_stepper.next} />
      </PanelActions>
    </Panel>
  )
}

export const _Company = ({draft, onUpdateReportDraft}: CompanyWithRequiredProps) => {
  const commonTree = (
    phoneOrWebsite: Pick<CompanyDraft, 'phone' | 'website'> = {},
    result: CompanySearchResult[] | undefined = undefined,
  ) => {
    return result && result.length > 0 ? (
      <CompanySearchResultComponent
        companies={result}
        onSubmit={(company, vendor) => {
          onUpdateReportDraft({
            companyDraft: {
              ...company,
              ...phoneOrWebsite,
            },
            vendor,
          })
        }}
      />
    ) : (
      <CompanyIdentifyBy companyKind={draft.companyKind!}>
        {identifyBy =>
          fnSwitch(identifyBy, {
            [IdentifyBy.NAME]: () => (
              <CompanySearchByNameAndPostalCode>
                {companies => (
                  <CompanySearchResultComponent
                    companies={companies ?? []}
                    onSubmit={company => {
                      onUpdateReportDraft({
                        companyDraft: company,
                      })
                    }}
                  />
                )}
              </CompanySearchByNameAndPostalCode>
            ),
            [IdentifyBy.IDENTITY]: () => (
              <CompanySearchByIdentity>
                {companies => (
                  <CompanySearchResultComponent
                    companies={companies ?? []}
                    onSubmit={company => {
                      onUpdateReportDraft({
                        companyDraft: company,
                      })
                    }}
                  />
                )}
              </CompanySearchByIdentity>
            ),
            [IdentifyBy.NONE]: () =>
              draft.companyKind === CompanyKinds.LOCATION ? (
                <CompanyAskConsumerStreet
                  onChange={form => {
                    onUpdateReportDraft({
                      companyDraft: {
                        ...phoneOrWebsite,
                        address: {
                          postalCode: form.postalCode,
                          street: form.street,
                        },
                      },
                    })
                  }}
                />
              ) : (
                <CompanyAskIsForeign>
                  {isForeign =>
                    fnSwitch(isForeign, {
                      [IsForeignCompany.Yes]: () => (
                        <CompanyAskConsumerPostalCode
                          onChange={form => {
                            onUpdateReportDraft({
                              companyDraft: {
                                ...phoneOrWebsite,
                                address: {
                                  postalCode: form.postalCode,
                                },
                              },
                            })
                          }}
                        />
                      ),
                      [IsForeignCompany.No]: () => (
                        <CompanyAskForeignDetails
                          onSubmit={form => {
                            onUpdateReportDraft({
                              companyDraft: {
                                name: form.name,
                                ...phoneOrWebsite,
                                address: {
                                  postalCode: form.postalCode,
                                  country: form.country.name,
                                },
                              },
                            })
                          }}
                        />
                      ),
                      [IsForeignCompany.Unknown]: () => (
                        <CompanyAskConsumerPostalCode
                          onChange={form => {
                            onUpdateReportDraft({
                              companyDraft: {
                                ...phoneOrWebsite,
                                address: {
                                  postalCode: form.postalCode,
                                },
                              },
                            })
                          }}
                        />
                      ),
                    })
                  }
                </CompanyAskIsForeign>
              ),
          })
        }
      </CompanyIdentifyBy>
    )
  }
  return (
    <>
      {fnSwitch(
        draft.companyKind!,
        {
          [CompanyKinds.PHONE]: () => <CompanyByPhone>{phone => commonTree({phone})}</CompanyByPhone>,
          [CompanyKinds.WEBSITE]: () => (
            <CompanyByWebsite>
              {(website, companies, countries) =>
                countries ? (
                  <CompanyWebsiteCountry
                    countries={countries}
                    onSubmit={country => {
                      onUpdateReportDraft({
                        companyDraft: {
                          website,
                          address: {
                            country,
                          },
                        },
                      })
                    }}
                  />
                ) : (
                  commonTree({website}, companies)
                )
              }
            </CompanyByWebsite>
          ),
        },
        () => commonTree(),
      )}
    </>
  )
}