import React, {Dispatch, ReactNode, SetStateAction, useContext} from 'react'
import {usePersistentState} from 'react-persistent-state'
import {ReportDraft2} from 'core/model/ReportDraft'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useApiSdk} from 'core/context/ApiSdk'
import {UseFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {SignalConsoPublicSdk} from '@signal-conso/signalconso-api-sdk-js'

export interface ReportFlowContextProps {
  reportDraft: Partial<ReportDraft2>
  setReportDraft: Dispatch<SetStateAction<Partial<ReportDraft2>>>
  clearReportDraft: () => void
  createReport: UseFetcher<SignalConsoPublicSdk['report']['create']>
}

const ReportFlowContext = React.createContext<ReportFlowContextProps>({} as ReportFlowContextProps)

interface ReportFlowProviderProps {
  children: ReactNode
  initialReport?: Partial<ReportDraft2>
}

export const ReportFlowProvider = ({initialReport, children}: ReportFlowProviderProps) => {
  const {apiSdk} = useApiSdk()
  const [reportDraft, setReportDraft, clearReportDraft] = usePersistentState<Partial<ReportDraft2>>(
    initialReport ?? {},
    'report-draft',
  )
  const createReport = useFetcher(apiSdk.report.create)
  return (
    <ReportFlowContext.Provider
      value={{
        reportDraft,
        setReportDraft,
        clearReportDraft,
        createReport,
      }}
    >
      {children}
    </ReportFlowContext.Provider>
  )
}

export const useReportFlowContext = (): ReportFlowContextProps => {
  return useContext<ReportFlowContextProps>(ReportFlowContext)
}
