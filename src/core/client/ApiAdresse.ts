import {ApiClient} from '@signal-conso/signalconso-api-sdk-js'

export type AdresseType = 'locality' | 'municipality' | 'street' | 'housenumber'

export interface City {
  label: string
  score: number,
  id: string
  type: string
  name: string
  postcode: string
  citycode: string
  x: number,
  y: number,
  population: number,
  city: string
  context: string
  importance: number
}

interface ApiAdresseFeature {
  geometry: {type: 'Point', coordinates: [number, number]}
  properties: City
  type: 'Feature'
}

interface ApiAdresseResult {
  attribution: string
  features: ApiAdresseFeature[]
  filters: {type: AdresseType}
  licence: string
  limit: number
  query: string
  type: string
  version: string
}

export class ApiAdresse {
  constructor(private client: ApiClient) {
  }

  readonly fetchCity = (q: string): Promise<City[]> => {
    if (q === '') return Promise.resolve([])
    return this.fetch<ApiAdresseResult>(q, 'municipality').then(_ => _.features.map(_ => _.properties))
  }

  private readonly fetch = <T>(q: string, type: AdresseType) => {
    return this.client.get<T>(`/search`, {
      qs: {
        q,
        type,
        autocomplete: 1
      }
    })
  }
}
