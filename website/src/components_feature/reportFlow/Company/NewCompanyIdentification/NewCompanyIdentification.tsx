import {Animate} from '@/components_simple/Animate'
import {ButtonWithLoader} from '@/components_simple/buttons/Buttons'
import {ScAutocompletePostcode} from '@/components_simple/formInputs/ScAutocompletePostcode'
import {ScCheckbox} from '@/components_simple/formInputs/ScCheckbox'
import {ScTextInput} from '@/components_simple/formInputs/ScTextInput'
import {FriendlyHelpText} from '@/components_simple/FriendlyHelpText'
import {getCompanyKind} from '@/feature/reportUtils'
import {Report} from '@/model/Report'
import {CommonCompanyIdentification} from '@/model/Step2Model'
import Button from '@codegouvfr/react-dsfr/Button'
import Link from 'next/link'
import {useState} from 'react'
import {PartialReport} from '../../ReportFlowContext'
import {CompanyAskForeignDetails} from '../CompanyAskForeignDetails'

export function NewCompanyIdentification({
  draft,
  onIdentification,
}: {
  draft: PartialReport & Pick<Report, 'step0' | 'step1'>
  onIdentification: (_: CommonCompanyIdentification) => void
}) {
  const [geographicalRestriction, setGeographicalRestriction] = useState(false)
  const [mode, setMode] = useState<'search' | 'cannotFind' | 'foreign'>('search')
  const companyKind = getCompanyKind(draft)
  return (
    <div>
      {
        <>
          <h2 className="fr-h6">Rechercher une entreprise</h2>
          <ScTextInput
            error={false}
            name="name"
            required
            autocomplete="autocompletion"
            desc="Entreprises françaises uniquement"
            // helperText="Entreprises françaises uniquement"
            label="Nom ou identifiant de l'entreprise"
            placeholder="Nom, n° SIRET/SIREN, n° RCS..."
            onBlur={() => {}}
            onChange={() => {}}
          />
          <div className={` ${geographicalRestriction ? 'p-4 pb-1 mb-4 border border-solid border-gray-300' : ''}`}>
            <ScCheckbox
              label="Restreindre la recherche à un département ou code postal"
              onChange={v => {
                setGeographicalRestriction(v)
              }}
              value={geographicalRestriction}
              required={true}
            />
            {geographicalRestriction && (
              <div className="max-w-lg">
                <ScAutocompletePostcode
                  error={false}
                  label="Département ou code postal"
                  name="foobar"
                  onBlur={() => {}}
                  onChange={() => {}}
                  // helperText="helper text"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <ButtonWithLoader iconId={'fr-icon-search-line'} onClick={() => {}} loading={false}>
              Je lance la recherche
            </ButtonWithLoader>
            <div className="flex flex-col">
              <Button onClick={() => setMode('cannotFind')} priority="tertiary no outline" iconId="ri-arrow-right-line">
                Je ne trouve pas / ne connais pas l'entreprise...
              </Button>
              <Button onClick={() => setMode('foreign')} priority="tertiary no outline" iconId="ri-arrow-right-line">
                L'entreprise est à l'étranger
              </Button>
            </div>
          </div>
        </>
      }
      {mode === 'cannotFind' && (
        <Animate autoScrollTo>
          <div>
            <FriendlyHelpText>
              {/* TODO ajuster pour cas où on ne contacte pas */}
              <p>
                <strong>
                  SignalConso ne fonctionne bien que quand vous identifiez l'entreprise avec laquelle vous avez un différent
                </strong>
                . Cela nous permet de la contacter immédiatement.
              </p>
              <p>
                Si vous avez besoin d'un moteur de recherche plus poussé, vous pouvez essayer{' '}
                <Link href={'https://annuaire-entreprises.data.gouv.fr/'} target="_blank">
                  L'Annuaire des Entreprises
                </Link>
                .
              </p>
              <p>
                Si vraiment vous ne pouvez pas identifier l'entreprise, vous pouvez continuer quand même votre signalement. Il
                sera communiqué aux agents de la répression des fraudes, qui feront de leur mieux pour traiter votre signalement.
                Mais les chances de succès diminuent grandement.
              </p>
              <div className="flex gap-4 justify-between">
                <Button priority="secondary" iconId="ri-arrow-left-line" onClick={() => setMode('search')}>
                  Je vais chercher un peu plus
                </Button>
                <Button priority="secondary" iconId="ri-arrow-right-line" iconPosition="right">
                  Je ne peux vraiment pas identifier l'entreprise
                </Button>
              </div>
            </FriendlyHelpText>
          </div>
        </Animate>
      )}
      {mode === 'foreign' && (
        <Animate autoScrollTo>
          <div>
            <CompanyAskForeignDetails
              {...{companyKind}}
              onSubmit={({name, postalCode, country: {code}}) => {
                onIdentification({
                  kind: 'foreignCompany',
                  companyName: name,
                  companyCountryCode: code,
                  consumerPostalCode: postalCode,
                })
              }}
            />
          </div>
        </Animate>
      )}
    </div>
  )
}
