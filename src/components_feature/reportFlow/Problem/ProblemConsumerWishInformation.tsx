import {FriendlyHelpText} from 'components_simple/FriendlyHelpText'
import {Animate} from 'components_simple/Animate'
import {I18nContextProps, useI18n} from 'i18n/I18n'
import {ConsumerWish} from 'model/ReportDraft'
import {Txt} from '../../../components_simple/Txt'

export function ProblemConsumerWishInformation({consumerWish}: {consumerWish: ConsumerWish}) {
  const {m} = useI18n()
  const textStyle = {lineHeight: '1.3'}
  return (
    <Animate>
      <FriendlyHelpText>
        <Txt sx={textStyle} block component="p" className="mb-0">
          {pickText(m, consumerWish)}
        </Txt>
        <Txt sx={{mt: 2, ...textStyle}} block component="p" className="mb-0">
          {pickSecondText(m, consumerWish)}
        </Txt>
      </FriendlyHelpText>
    </Animate>
  )
}

function pickText(m: I18nContextProps['m'], consumerWish: ConsumerWish) {
  switch (consumerWish) {
    case 'fixContractualDispute':
      return <span dangerouslySetInnerHTML={{__html: m.consumerWishFixContractualDispute}} />
    case 'companyImprovement':
      return m.consumerWishCompanyImprovement
    case 'getAnswer':
      return m.consumerWishGetAnswer
  }
}

function pickSecondText(m: I18nContextProps['m'], consumerWish: ConsumerWish) {
  m.consumerWishFixContractualDispute
  switch (consumerWish) {
    case 'fixContractualDispute':
    case 'companyImprovement':
      return m.consumerWishInvestigationIsPossible
    case 'getAnswer':
      return m.consumerWishInvestigationIsPossible2
  }
}
