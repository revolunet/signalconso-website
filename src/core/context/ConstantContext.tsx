import * as React from 'react'
import {ReactNode, useContext, useMemo} from 'react'
import {UseFetcher, useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {ApiError, SignalConsoPublicSdk} from '@signal-conso/signalconso-api-sdk-js'
import {useApiSdk} from './ApiSdk'

export interface ConstantContextProps {
  regions: UseFetcher<SignalConsoPublicSdk['constant']['getRegions'], ApiError>
  countries: UseFetcher<SignalConsoPublicSdk['constant']['getCountries'], ApiError>
  departmentsIndex?: {[key: string]: string}
}

interface Props {
  children: ReactNode
}

const defaultContext: Partial<ConstantContextProps> = {}

const ConstantContext = React.createContext<ConstantContextProps>(defaultContext as ConstantContextProps)

export const ConstantProvider = ({children}: Props) => {
  const {apiSdk} = useApiSdk()
  const _regions = useFetcher(apiSdk.constant.getRegions)
  const _countries = useFetcher(apiSdk.constant.getCountries)
  const departmentsIndex = useMemo(
    () => _regions.entity?.flatMap(_ => _.departments).reduce((acc, dep) => ({...acc, [dep.code]: dep.label}), {}),
    [_regions.entity],
  )
  return (
    <ConstantContext.Provider
      value={{
        regions: _regions,
        countries: _countries,
        departmentsIndex,
      }}
    >
      {children}
    </ConstantContext.Provider>
  )
}

export const useConstantContext = (): ConstantContextProps => {
  return useContext<ConstantContextProps>(ConstantContext)
}
