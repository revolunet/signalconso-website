import {Txt} from 'alexlibs/mui-extension/Txt/Txt'
import {ContentPageContainer} from 'components_simple/ContentPageContainer'
import ComputeWithdrawalPeriod from './ComputeWithdrawalPeriod'
import {getI18n} from '../i18n/I18nDictionnary'
import {Metadata} from 'next'

export function getMetadata(): Metadata {
  const {messages: m} = getI18n('fr')

  return {
    title: m.titleAndDescriptions.delaiRetractation.title,
    description: m.titleAndDescriptions.delaiRetractation.description,
  }
}

export const DelaiDeRetractation = () => {
  const {messages: m} = getI18n('fr')

  return (
    <>
      <ContentPageContainer>
        <h1>{m.delaiRetractation.pageTitle}</h1>
        <section className="fr-pb-4w">
          <ComputeWithdrawalPeriod />
        </section>
        <section className="fr-pb-4w">
          <h2 className="fr-h4">{m.delaiRetractation.startDateExplanationTitle}</h2>
          <table className="fr-table">
            <thead>
              <tr>
                <th>{m.delaiRetractation.contractTypeHeader}</th>
                <th>{m.delaiRetractation.dateToConsiderHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{m.delaiRetractation.serviceContract}</td>
                <td>{m.delaiRetractation.contractConclusionDate}</td>
              </tr>
              <tr>
                <td>{m.delaiRetractation.waterGasElectricityContract}</td>
                <td>{m.delaiRetractation.contractConclusionDate}</td>
              </tr>
              <tr>
                <td>{m.delaiRetractation.deliveredProducts}</td>
                <td>{m.delaiRetractation.deliveryDate}</td>
              </tr>
              <tr>
                <td>{m.delaiRetractation.deliveredProductsMultiplePackages}</td>
                <td>{m.delaiRetractation.receptionDateLastItem}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="fr-pb-4w">
          <h2 className="fr-h4">{m.delaiRetractation.changeOfMindTitle}</h2>
          <p>{m.delaiRetractation.justificationNotRequired}</p>
          <p>
            {m.delaiRetractation.returnFormOrLetter}{' '}
            <Txt bolder span>
              {m.delaiRetractation.recommendedLetterWithAcknowledgment}
            </Txt>{' '}
            {m.delaiRetractation.withinFourteenDays}.
            <br />
            {m.delaiRetractation.canAlsoDoItOnline} {m.delaiRetractation.websiteRequirement}.
            <br />
            {m.delaiRetractation.reportingOnWebsiteNotSufficient}
          </p>
          <p>
            {m.delaiRetractation.keepDocumentation1}
            <br />
            {m.delaiRetractation.keepDocumentation2}
          </p>
          <p>
            {m.delaiRetractation.ifSellerDidNotInform}.
            <br />
            {m.delaiRetractation.extensionOfTwelveMonths}.
          </p>
        </section>
      </ContentPageContainer>
    </>
  )
}
