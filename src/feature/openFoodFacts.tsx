import {Anomaly} from '@/anomalies/Anomaly'
import {buildCompanyName} from '@/components_simple/CompanyRecap/CompanyRecap'
import {BarcodeProduct} from '@/model/BarcodeProduct'
import {CompanySearchResult} from '@/model/Company'
import {ReportDraft2} from '@/model/ReportDraft2'
import {useSearchParams} from 'next/navigation'
import {ReactNode, useMemo} from 'react'
import {useBarcodeSearch} from './barcode'

const OPENFOODFACTS_BARCODE_PARAM = 'gtin'

export type OpenFfResult = {
  barcode: string
  product?: BarcodeProduct
  company?: CompanySearchResult
}

type OpenFfSetup =
  | {
      status: 'skipped'
    }
  | {
      status: 'loading'
    }
  | {
      status: 'loaded'
      result: OpenFfResult
    }

export function useOpenFfSetup(anomaly: Anomaly): OpenFfSetup {
  const barcode = useBarcodeParam(anomaly)
  const _query = useBarcodeSearch(barcode)

  // The resulting object shouldn't change ref all the time
  return useMemo(() => {
    if (barcode) {
      if (_query.data) {
        return {
          status: 'loaded',
          result: {
            barcode,
            product: _query.data.product,
            company: _query.data.company,
          },
        }
      }
      if (_query.status === 'pending') {
        return {
          status: 'loading',
        }
      }
    }
    // We're not in the openFF case
    // or we are, but ended up in an error case somehow. Let's forget about it.
    return {status: 'skipped'}
  }, [barcode, _query.data, _query.status])
}

function useBarcodeParam(anomaly: Anomaly) {
  const searchParams = useSearchParams()
  return (anomaly.isSpecialOpenFoodFactsCategory && searchParams.get(OPENFOODFACTS_BARCODE_PARAM)?.trim()) || undefined
}

export function recreateOpenFfBarcodeParam(reportDraft: Partial<ReportDraft2>) {
  const barcode = reportDraft.openFf?.barcode
  const params = new URLSearchParams()
  if (barcode) {
    params.set(OPENFOODFACTS_BARCODE_PARAM, barcode)
  }
  return params
}

export function OpenFfWelcomeText({setup}: {setup: OpenFfSetup}) {
  if (setup.status === 'skipped') {
    return null
  }
  if (setup.status === 'loading') {
    return <Loader />
  }
  const {barcode, product, company} = setup.result
  if (product && company) {
    return <WelcomeProductFull product={product} company={company} />
  }
  if (product) {
    return <WelcomeProductWithoutCompany product={product} />
  }
  return <WelcomeInvalidBarcode barcode={barcode} />
}

function Loader() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="sc-loader-big w-20 h-20"></div>
    </div>
  )
}

// Pas d'intertionalisation, la feature n'existe pas en version anglaise

function WelcomeInvalidBarcode({barcode}: {barcode: string}) {
  return (
    <BlueBanner>
      <p className="mb-2 mt-4">
        <i className="ri-information-line mr-2" />
        Vous avez rencontré un problème avec ce produit (code-barres <span className="font-bold">{barcode}</span>) ?
      </p>
      <p className="mb-2 mt-4">
        Nous n'avons pas pu identifier ce produit. Vous pouvez néanmoins faire un signalement sur SignalConso. Nous vous
        demanderons d'identifier manuellement l'entreprise à l'origine de ce produit.
      </p>
      <p></p>
      <p className="mb-4">
        SignalConso vous permet de notifier le problème à l'entreprise. De plus, votre signalement est visible par les agents de
        la répression des fraudes qui pourront intervenir si nécessaire.
      </p>
      <LetUsGuideYou />
    </BlueBanner>
  )
}

function WelcomeProductWithoutCompany({product}: {product: BarcodeProduct}) {
  return (
    <BlueBanner>
      {/* Cas où on a le produit mais sans l'entreprise */}
      <p className="mb-2 mt-4">
        <i className="ri-information-line mr-2" />
        Vous avez rencontré un problème avec le produit <span className="font-bold">{product.productName ?? product.gtin}</span> ?
      </p>
      <p className="mb-4">
        SignalConso vous permet d'en informer l'entreprise. De plus, votre signalement est visible par les agents de la répression
        des fraudes qui pourront intervenir si nécessaire.
      </p>
      <p className="mb-4">
        Nous n'avons pas pu automatiquement identifier l'entreprise à l'origine de ce produit, nous vous demanderons donc de
        l'identifier manuellement.
      </p>
      <LetUsGuideYou />
    </BlueBanner>
  )
}
function WelcomeProductFull({product, company}: {product: BarcodeProduct; company: CompanySearchResult}) {
  return (
    <BlueBanner>
      {/* Cas complet */}
      <p className="mb-2 mt-4">
        <i className="ri-information-line mr-2" />
        Vous avez rencontré un problème avec le produit <span className="font-bold">
          {product.productName ?? product.gtin}
        </span>{' '}
        produit par l'entreprise <span className="font-bold">{buildCompanyName({company: company})}</span> ?
      </p>
      <p className="mb-4">
        SignalConso vous permet d'en informer l'entreprise. De plus, votre signalement est visible par les agents de la répression
        des fraudes qui pourront intervenir si nécessaire.
      </p>
      <LetUsGuideYou />
    </BlueBanner>
  )
}

function LetUsGuideYou() {
  return <p className="text-center font-bold mb-2">Répondez simplement aux questions et laissez-vous guider !</p>
}

function BlueBanner({children}: {children: ReactNode}) {
  return (
    <div className="py-4 px-8 mb-8 bg-sclightblueinfo text-scblueinfo border-y-[1px] border-0 border-solid border-scblueinfo">
      {children}
    </div>
  )
}