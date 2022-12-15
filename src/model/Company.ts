import {Address} from './Address'

export interface CompanySearchResult {
  siret: string
  name?: string
  brand?: string
  isHeadOffice: boolean
  isPublic: boolean
  isOpen: boolean
  address: Address
  activityCode: string
  activityLabel?: string
  isMarketPlace: boolean
}

export interface WebsiteCompanySearchResult {
  exactMatch: CompanySearchResult[]
  similarHosts: string[]
}

export interface Company {
  id: string
  siret: string
  creationDate: Date
  name: string
  address: Address
  activityCode?: string
  isHeadOffice: boolean
  isPublic: boolean
  isOpen: boolean
}
