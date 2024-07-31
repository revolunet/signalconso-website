import {findAnomaly} from '@/anomalies/Anomalies'
import {CompanyKind, ReportTag, Subcategory} from '@/anomalies/Anomaly'
import {ReportDraft, TransmissionStatus} from '@/model/ReportDraft'
import {ReportDraft2} from '@/model/ReportDraft2'
import {lastFromArray, notUndefined} from '@/utils/utils'

export function hasStep0(r: Partial<ReportDraft2>): r is Pick<ReportDraft, 'step0'> & Partial<ReportDraft2> {
  return !!r.step0
}
export function hasSubcategoryIndexes(
  r: Partial<ReportDraft2>,
): r is Pick<ReportDraft, 'subcategoriesIndexes'> & Partial<ReportDraft2> {
  return !!r.subcategoriesIndexes
}
export function hasStep2(r: Partial<ReportDraft2>): r is Pick<ReportDraft, 'step2'> & Partial<ReportDraft2> {
  return !!r.step2
}
export function hasEmployeeConsumer(
  r: Partial<ReportDraft2>,
): r is Pick<ReportDraft2, 'employeeConsumer'> & Partial<ReportDraft2> {
  return r.employeeConsumer !== undefined
}
export function hasConsumerWish(r: Partial<ReportDraft2>): r is Pick<ReportDraft2, 'consumerWish'> & Partial<ReportDraft2> {
  return r.consumerWish !== undefined
}

export const getAnomaly = (r: Pick<ReportDraft, 'step0'>) => {
  return findAnomaly(r.step0.category, r.step0.lang)
}

export const getSubcategories = (r: Pick<ReportDraft, 'subcategoriesIndexes' | 'step0'>): Subcategory[] => {
  const anomaly = findAnomaly(r.step0.category, r.step0.lang)
  const startingIndexes = r.subcategoriesIndexes
  const collectedSubcategories: Subcategory[] = []
  function recurse(indexes: number[], subcategories: Subcategory[] = []) {
    if (indexes.length === 0) {
      return
    }
    const [index, ...indexesLeft] = indexes
    const subcategory = subcategories[index]
    if (!subcategory) {
      throw new Error(
        `Nonsensical subcategory indexes ${startingIndexes} for category ${r.step0.category} (${r.step0.lang}). Can't find index ${index} in ${subcategories.length} subcategories`,
      )
    }
    collectedSubcategories.push(subcategory)
    recurse(indexesLeft, subcategory.subcategories)
  }
  recurse(r.subcategoriesIndexes, anomaly.subcategories)
  return collectedSubcategories
}

export const getTags = (r: Pick<ReportDraft, 'subcategoriesIndexes' | 'step0'>): ReportTag[] => {
  return getSubcategories(r).flatMap(_ => _.tags ?? [])
}

export const getCompanyKind = (r: Pick<ReportDraft, 'step0' | 'subcategoriesIndexes' | 'companyKindOverride'>): CompanyKind => {
  const {companyKindOverride} = r
  return companyKindOverride ? companyKindOverride : getWipCompanyKindFromSelected(r) ?? 'SIRET'
}

export const getReponseConsoCode = (r: Pick<ReportDraft, 'step0' | 'subcategoriesIndexes'>) => {
  // 2023-12 ReponseConso says we should not send them multiple reponseConso codes, it breaks something for them
  // We should send only one code maximum, and it doesn't really matter which one
  return lastFromArray(
    getSubcategories(r)
      .map(_ => _.reponseconsoCode)
      .filter(notUndefined),
  )
}

export const getCcrfCode = (r: Pick<ReportDraft, 'step0' | 'subcategoriesIndexes'>) => {
  const codes = getSubcategories(r).flatMap(_ => _.ccrfCode ?? [])
  return Array.from(new Set(codes))
}

export const getCategoryOverride = (r: Pick<ReportDraft, 'step0' | 'subcategoriesIndexes'>) => {
  return [...getSubcategories(r)].reverse().find(_ => !!_.categoryOverride)?.categoryOverride
}

// Returns the company kind for a WIP draft during step1
// - the subcategories may not all be picked
// - we do not apply the companyKindOverride
// - we may return undefined if the selected subcategories have no CompanyKind
//   (we do not apply a default CompanyKind value yet)
export const getWipCompanyKindFromSelected = (
  r: Pick<ReportDraft, 'step0'> & Partial<Pick<ReportDraft, 'subcategoriesIndexes' | 'companyKindOverride'>>,
): CompanyKind | undefined => {
  const {specialCategory} = getAnomaly(r)
  return specialCategory === 'OpenFoodFacts'
    ? 'PRODUCT_OPENFF'
    : specialCategory === 'RappelConso'
      ? 'PRODUCT_RAPPEL_CONSO'
      : hasSubcategoryIndexes(r)
        ? [...getSubcategories(r)].reverse().find(_ => !!_.companyKind)?.companyKind
        : undefined
}

export const isTransmittableToPro = (r: Pick<ReportDraft, 'employeeConsumer' | 'consumerWish'>): boolean => {
  return isTransmittableToProBeforePickingConsumerWish(r) && r.consumerWish !== 'getAnswer'
}
export const isTransmittableToProBeforePickingConsumerWish = (r: Pick<ReportDraft, 'employeeConsumer'>): boolean => {
  return !r.employeeConsumer
}

export const getTransmissionStatus = (
  r: Pick<ReportDraft, 'employeeConsumer' | 'consumerWish' | 'step2'>,
): TransmissionStatus => {
  if (!isTransmittableToPro(r)) {
    return 'NOT_TRANSMITTABLE'
  }
  switch (r.step2.kind) {
    case 'influencer':
    case 'influencerOtherSocialNetwork':
    case 'train':
    case 'station':
      return 'WILL_BE_TRANSMITTED'
    case 'basic':
    case 'phone':
    case 'product':
    case 'website':
      switch (r.step2.companyIdentification.kind) {
        case 'companyFound':
        case 'marketplaceCompanyFound': {
          const company = r.step2.companyIdentification.company
          const country = company.address.country
          if (country && country !== 'FR') {
            // SIRET existant mais adresse postale à l'étranger
            return 'CANNOT_BE_TRANSMITTED'
          }
          return 'WILL_BE_TRANSMITTED'
        }
        case 'consumerLocation':
        case 'consumerPreciseLocation':
          return 'MAY_BE_TRANSMITTED'
        case 'foreignCompany':
        case 'foreignWebsiteWithJustCountry':
          return 'CANNOT_BE_TRANSMITTED'
      }
  }
}
