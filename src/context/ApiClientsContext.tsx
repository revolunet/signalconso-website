import * as React from 'react'
import {ReactNode, useContext} from 'react'
import {CompanyPublicClient} from '../clients/CompanyPublicClient'
import {SignalConsoApiClient} from '../clients/SignalConsoApiClient'
import {AdresseApiClient} from '../clients/AdresseApiClient'

interface ApiClientsContextProps {
  signalConsoApiClient: SignalConsoApiClient
  companyApiClient: CompanyPublicClient
  adresseApiClient: AdresseApiClient
}

interface Props {
  overrideForTests?: {
    signalConsoApiClient?: SignalConsoApiClient
    companyApiClient?: CompanyPublicClient
    adresseApiClient?: AdresseApiClient
  }
  children: ReactNode
}

const ApiClients = React.createContext<ApiClientsContextProps>({} as ApiClientsContextProps)

export const ApiClientsProvider = ({overrideForTests, children}: Props) => {
  return (
    <ApiClients.Provider
      value={{
        signalConsoApiClient: overrideForTests?.signalConsoApiClient ?? new SignalConsoApiClient(),
        companyApiClient: overrideForTests?.companyApiClient ?? new CompanyPublicClient(),
        adresseApiClient: overrideForTests?.adresseApiClient ?? new AdresseApiClient(),
      }}
    >
      {children}
    </ApiClients.Provider>
  )
}

export const useApiClients = (): ApiClientsContextProps => {
  return useContext<ApiClientsContextProps>(ApiClients)
}