import {appConfig} from 'core/appConfig'
import {BaseApiClient} from './BaseApiClient'
import {WebsiteCompanySearchResult} from '../model/Company'
import {Country} from '../model/Country'
import {FileOrigin, UploadedFile} from '../model/UploadedFile'
import {Report} from '../model/Report'
import {ReportDraft} from '../model/ReportDraft'
import {Subcategory} from 'anomalies/Anomaly'
import {ConsumerEmailResult} from 'model/ConsumerEmailValidation'
import {ApiReportDraft} from 'model/reportsFromApi'

type PublicStat =
  | 'PromesseAction'
  | 'Reports'
  | 'TransmittedPercentage'
  | 'ReadPercentage'
  | 'ResponsePercentage'
  | 'WebsitePercentage'

export type CountByDate = {
  date: Date
  count: number
}

export class SignalConsoApiClient {
  private readonly client: BaseApiClient = new BaseApiClient({
    baseUrl: appConfig.apiBaseUrl + '/api',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  searchCompaniesByUrl = (url: string) => {
    return this.client.get<WebsiteCompanySearchResult>(`/companies/hosts`, {qs: {url}})
  }

  searchForeignCompaniesByUrl = (url: string) => {
    return this.client.get<Country[]>(`/websites/search-url`, {qs: {url}})
  }

  createReport = (draft: ReportDraft) => {
    const body: ApiReportDraft = ReportDraft.toApi(draft)
    return this.client.post<Report>(`/reports`, {body}).then(
      (report: {[key in keyof Report]: any}): Report => ({
        ...report,
        companyAddress: {
          ...report.companyAddress,
          country: report.companyAddress.country?.name,
        },
        creationDate: new Date(report.creationDate),
      }),
    )
  }

  getPublicStatCount = (publicStat: PublicStat) => {
    return this.client.get<number>(`stats/reports/public/count`, {qs: {publicStat}})
  }

  getPublicStatCurve = async (publicStat: PublicStat): Promise<CountByDate[]> => {
    const res = await this.client.get<{count: number; date: string}[]>(`stats/reports/public/curve`, {qs: {publicStat}})
    return res.map(({date, ...rest}) => ({
      date: new Date(date),
      ...rest,
    }))
  }

  getCountries = () => this.client.get<Country[]>(`/constants/countries`)

  getDocumentLink = (file: UploadedFile) => `${this.client.baseUrl}/reports/files/${file.id}/${encodeURI(file.filename)}`

  uploadDocument = (file: File, origin: FileOrigin) => {
    const fileFormData: FormData = new FormData()
    fileFormData.append('reportFile', file, file.name)
    fileFormData.append('reportFileOrigin', origin)
    return this.client.post<UploadedFile>(`reports/files`, {body: fileFormData})
  }

  rateSubcategory = (category: string, subcategories: Subcategory[], positive: boolean): Promise<void> => {
    return this.client.post(`/rating`, {
      body: {
        category,
        subcategories: subcategories
          ? subcategories.map(subcategory => (subcategory.title ? subcategory.title : subcategory))
          : [''],
        positive,
      },
    })
  }

  checkEmail = (email: string) => {
    return this.client.post<{valid: boolean}>('/email-validation/check', {body: {email}})
  }

  checkEmailAndValidate = (email: string, confirmationCode: string) => {
    return this.client.post<ConsumerEmailResult>('/email-validation/check-and-validate', {body: {email, confirmationCode}})
  }
}
