import {allAnomalies} from '@/anomalies/Anomalies'
import {AppLang} from '@/i18n/localization/AppLangs'
import {BarcodeProduct} from '@/model/BarcodeProduct'
import {getIndexForStep, ReportStep, reportSteps} from '@/model/ReportStep'
import {InfoWall, reportTags, socialNetworks, Subcategory} from '../anomalies/Anomaly'
import {Address, ApiAddress} from '../model/Address'
import {CompanySearchResult, WebsiteCompanySearchResult} from '../model/Company'
import {CreatedReport} from '../model/CreatedReport'
import {Influencer, ReportDraft} from '../model/ReportDraft'
import {FileOrigin} from '../model/UploadedFile'

export class SeedableRandom {
  seed = 1
  constructor(seed: number) {
    this.seed = seed
  }
  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  // approximately random, it's enough for us
  // Returns a number between 0 and 1
  number() {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  string({
    length = 10,
    charset = 'alphabetic',
    capitalization = 'lowercase',
  }: {length?: number; charset?: 'numeric' | 'alphabetic'; capitalization?: 'lowercase' | 'uppercase'} = {}) {
    let result = ''
    const characters =
      charset === 'numeric'
        ? '0123456789'
        : capitalization === 'lowercase'
          ? 'abcdefghijklmnopqrstuvwxyz'
          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(this.number() * charactersLength))
      counter += 1
    }
    return result
  }

  oneOf(array: any[]) {
    return array[Math.floor(this.number() * array.length)]
  }

  boolean() {
    return this.oneOf([false, true])
  }

  siret() {
    return this.string({
      length: 14,
      charset: 'numeric',
    })
  }

  phone() {
    return this.string({
      length: 10,
      charset: 'numeric',
    })
  }

  email() {
    return (
      this.string({
        length: 10,
        charset: 'alphabetic',
      }) +
      this.string({
        length: 10,
        charset: 'alphabetic',
      })
    )
  }
}

const defaultRandom = new SeedableRandom(1)

export class Fixture {
  private static readonly lastNames = ['Doe', 'Durand', 'Dupont']

  private static readonly firstNames = ['Alice', 'Bob', 'Charles', 'Danièle', 'Émilien', 'Fanny', 'Gérard']

  private static readonly genDetails = (random: SeedableRandom) => [
    {label: "Date de constat (ou date d'achat) :", value: '09/03/2022'},
    {label: 'Quel est le nom du produit :', value: 'oo'},
    {
      label: 'Pourquoi trouvez-vous la publicité trompeuse :',
      value:
        'le produit ne remplit pas sa promesse, la photo du produit est trompeuse, les labels (bio, naturel...) sont trompeurs',
    },
    {label: 'Où avez-vous vu ces informations :', value: 'site internet, publicité (affiche, dans un magazine)'},
    {
      label: 'Description :',
      value:
        'Suite à l’achat de pass à l’occasion du Passage Musique Festival pour plus de 400€ qui devait avoir lieu en 2018 je n’ai toujours pas reçu de remboursements malgré plusieurs relances.',
    },
  ]

  static readonly genReport = (random: SeedableRandom = defaultRandom): CreatedReport => {
    const company = Fixture.genCompanySearchResult(random)
    const subcategories = [Fixture.genSubcategory({}, random), Fixture.genSubcategory({}, random)]
    return {
      companyAddress: Fixture.genApiAddress(random),
      companySiret: company.siret,
      websiteURL: random.string(),
      tags: subcategories.filter(_ => !!_.tags).flatMap(_ => _.tags!),
      employeeConsumer: random.boolean(),
      contactAgreement: random.boolean(),
      postReportHelper: {
        title: `Titre d'aide... vous voulez en savoir plus sur [le sujet du signalement] ?`,
        content: `Contenu d'aide... rendez-vous sur <a href=\"#" target=\"_blank\">les fiches pratiques de la DGCCRF</a>`,
      },
    }
  }

  static readonly genDraftReportStep2 = ({random = defaultRandom}: {random?: SeedableRandom}) => {
    const lang = 'fr'
    const anomaly = random.oneOf(allAnomalies(lang))
    const category = anomaly.category
    const step0: ReportDraft['step0'] = {
      category,
      lang,
    }
    const problemFields = {
      consumerWish: 'fixContractualDispute',
      subcategoriesIndexes: [0, 0],
    }
    const step2: ReportDraft['step2'] = {
      kind: 'basic',
      companyIdentification: {kind: 'companyFound', company: Fixture.genCompanySearchResult(random)},
    }
    return {
      step0,
      ...problemFields,
      step2,
    }
  }

  static readonly genDraftReport = (
    currentLang: AppLang,
    lastStep: ReportStep,
    random: SeedableRandom = defaultRandom,
  ): Partial<ReportDraft> => {
    const stepOrder: {[key in ReportStep]: (_: Partial<ReportDraft>) => Partial<ReportDraft>} = {
      BuildingProblem: _ => {
        const anomaly = random.oneOf(allAnomalies(currentLang))
        const category = anomaly.category
        return {
          ..._,
          step0: {category, lang: currentLang},
          consumerWish: random.oneOf(['fixContractualDispute', 'companyImprovement', 'getAnswer']),
          subcategoriesIndexes: [0, 0],
          employeeConsumer: random.boolean(),
        }
      },
      BuildingCompany: _ => ({
        ..._,
        step2: {
          kind: 'product',
          barcodeProduct: Fixture.genBarcodeProduct(random),
          companyIdentification: {
            kind: 'companyFound',
            company: Fixture.genCompanySearchResult(random),
          },
        },
      }),
      BuildingDetails: _ => ({
        ..._,
        step3: {
          details: Fixture.genDetails(random),
          uploadedFiles: [
            {
              filename: 'Captura de pantalla 2022-03-14 a las 18.40.21.png',
              id: '8710d67d-d955-444d-b340-ee17c7b781e9',
              loading: false,
              origin: FileOrigin.Consumer,
            },
          ],
        },
      }),
      BuildingConsumer: _ => ({
        ..._,
        step4: {
          consumer: Fixture.genConsumer(random),
          contactAgreement: random.boolean(),
        },
      }),
      Confirmation: _ => ({
        ..._,
        consumer: Fixture.genConsumer(random),
        contactAgreement: random.boolean(),
      }),
    }
    return reportSteps
      .filter((_, i) => i <= getIndexForStep(lastStep))
      .reduce((draft: Partial<ReportDraft>, step: ReportStep) => {
        return stepOrder[step](draft)
      }, {})
  }

  static readonly genConsumer = (random: SeedableRandom = defaultRandom): ReportDraft['step4']['consumer'] => {
    return {
      firstName: random.oneOf(Fixture.firstNames),
      lastName: random.oneOf(Fixture.lastNames),
      email: random.email(),
    }
  }

  static readonly genAddress = (random: SeedableRandom = defaultRandom): Address => {
    return {
      number: random.string({charset: 'numeric', length: 2}),
      street: random.string({charset: 'alphabetic', capitalization: 'lowercase'}),
      city: random.oneOf(['Paris', 'Tunis', 'Nairobi', 'Pont-Aven', 'Chamonix']),
      postalCode: random.string({length: 5, charset: 'numeric'}),
    }
  }

  static readonly genApiAddress = (random: SeedableRandom = defaultRandom): ApiAddress => {
    return {
      ...Fixture.genAddress(random),
      country: undefined,
    }
  }

  static readonly genWebsiteCompanySearchResult = (random: SeedableRandom = defaultRandom) => {
    return <WebsiteCompanySearchResult>{
      exactMatch: [
        <CompanySearchResult>{
          name: random.string({capitalization: 'lowercase', charset: 'alphabetic', length: 8}),
          address: Fixture.genAddress(random),
        },
      ],
      similarHosts: [],
    }
  }

  static readonly genCompanySearchResult = (random: SeedableRandom = defaultRandom): CompanySearchResult => {
    return {
      name: random.string({capitalization: 'lowercase', charset: 'alphabetic', length: 8}),
      commercialName: random.string({capitalization: 'lowercase', charset: 'alphabetic', length: 14}),
      brand: random.string({capitalization: 'lowercase', charset: 'alphabetic', length: 6}),
      siret: random.siret(),
      address: Fixture.genAddress(random),
      isHeadOffice: random.boolean(),
      isPublic: random.boolean(),
      isOpen: random.boolean(),
      activityCode: '46.36B',
      activityLabel: 'Commerce de gros (commerce interentreprises) alimentaire spécialisé divers',
      isMarketPlace: random.boolean(),
    }
  }

  static readonly genSubcategory = (params: Partial<Subcategory> = {}, random: SeedableRandom = defaultRandom) => {
    return <Subcategory>{
      title: random.string({capitalization: 'lowercase', charset: 'alphabetic'}),
      id: random.string(),
      postReportHelper: {
        title: 'random title',
        content: 'random content',
      },
      tags: random.oneOf([null, ...reportTags]),
      ...params,
    }
  }

  static readonly genBarcodeProduct = (random: SeedableRandom = defaultRandom): BarcodeProduct => {
    return {
      id: random.string(),
      gtin: random.string(),
      productName: random.string(),
      siren: random.siret(),
    }
  }

  static readonly genInformation = (random: SeedableRandom = defaultRandom) => {
    return <InfoWall>{
      title: random.string(),
    }
  }

  static readonly genInfluencer = (random: SeedableRandom = defaultRandom) => {
    return <Influencer>{
      socialNetwork: random.oneOf([...socialNetworks]),
      name: random.string(),
    }
  }
}
