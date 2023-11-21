'use client'

import {DsfrProvider} from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider'
import {getHtmlAttributes} from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes'
import * as Sentry from '@sentry/nextjs'
import {usePathname} from 'next/navigation'
import {Fender} from '../components_simple/Fender'
import {Page} from '../components_simple/Page'
import '../globals.css'
import {getI18n} from '../i18n/I18nDictionnary'
import {AppLangs, getSupportedLang} from '../i18n/localization/AppLangs'
import MuiThemeSetup from './[lang]/MuiThemeSetup'
import {DSFR_COLOR_SCHEME} from '@/core/theme'

export default function GlobalError({error, reset}: {error: any; reset: any}) {
  Sentry.captureException(error)
  // Flushing before returning is necessary if deploying to Vercel, see
  // https://vercel.com/docs/platform/limits#streaming-responses
  Sentry.flush(2000)
  return <ErrorContent />
}

// November 2023 : I can't seem to be able to display this error
// it might be a Next.js bug :
// https://github.com/intuita-inc/cal.com-demo/pull/24
// https://github.com/vercel/next.js/issues/50119
// https://github.com/vercel/next.js/issues/55462
// https://github.com/vercel/next.js/issues/46964
// etc.
// note for when this file is useful again :
// It is for very rare global errors, so I think we can afford to simplify it,
// not use i18n messages, maybe not DSFR, etc.

function ErrorContent() {
  const pathname = usePathname()
  console.log(pathname)
  const currentPathLang = pathname ? pathname.toLowerCase().split('/')[1] : AppLangs.fr
  const lang = getSupportedLang(currentPathLang) ?? AppLangs.fr

  const {messages: m} = getI18n(lang)

  return (
    <html
      {...getHtmlAttributes({defaultColorScheme: DSFR_COLOR_SCHEME, lang: lang})}
      //NOTE: Scrollbar always visible to avoid layout shift when modal are opened
      style={{
        overflow: '-moz-scrollbars-vertical',
        overflowY: 'scroll',
      }}
      lang={lang}
    >
      <body>
        <MuiThemeSetup>
          <DsfrProvider lang={lang}>
            <Page>
              <Fender
                icon="error"
                title={m.minimalErrorTitle}
                description={
                  <div
                    style={{
                      marginTop: 30,
                      marginBottom: 30,
                    }}
                    dangerouslySetInnerHTML={{__html: m.minimalErrorText}}
                  />
                }
              ></Fender>
            </Page>
          </DsfrProvider>
        </MuiThemeSetup>
      </body>
    </html>
  )
}
