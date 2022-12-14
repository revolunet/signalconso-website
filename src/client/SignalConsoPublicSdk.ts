import {PublicReportClient} from './report/PublicReportClient'
import {PublicStatsClient} from './stats/PublicStatsClient'
import {ApiClient} from './ApiClient'
import {PublicConsumerEmailValidationClient} from './consumer-email-validation/PublicConsumerEmailValidationClient'
import {PublicConstantClient} from './constant/PublicConstantClient'
import {FileClient} from './file/FileClient'
import {RatingClient} from './rating/RatingClient'
import {PublicWebsiteClient} from './company/PublicWebsiteClient'
import {appConfig} from 'conf/appConfig'

export class SignalConsoPublicSdk {
  private readonly client: ApiClient = new ApiClient({
    baseUrl: appConfig.apiBaseUrl + '/api',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
  readonly website: PublicWebsiteClient
  readonly report: PublicReportClient
  readonly stats: PublicStatsClient
  readonly constant: PublicConstantClient
  readonly document: FileClient
  readonly rating: RatingClient
  readonly consumerEmail: PublicConsumerEmailValidationClient

  constructor() {
    this.website = new PublicWebsiteClient(this.client)
    this.report = new PublicReportClient(this.client)
    this.stats = new PublicStatsClient(this.client)
    this.constant = new PublicConstantClient(this.client)
    this.document = new FileClient(this.client)
    this.rating = new RatingClient(this.client)
    this.consumerEmail = new PublicConsumerEmailValidationClient(this.client)
  }
}
