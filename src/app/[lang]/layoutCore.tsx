'use client'
import {SkipLinks} from '@codegouvfr/react-dsfr/SkipLinks'
import {Box} from '@mui/material'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ApiClientsProvider} from '@/context/ApiClientsContext'
import {usePathname} from 'next/navigation'
import Script from 'next/script'
import React, {useEffect, useState} from 'react'
import {monkeyPatchDomForGoogleTranslate} from '@/utils/fixGoogleTranslate'
import {ToastProvider} from '../../hooks/useToastError'
import {AnalyticProvider} from '../../analytic/AnalyticContext'
import {Analytic, PageChangesListener} from '../../analytic/analytic'
import {ReportCreateProvider} from '../../components_feature/reportFlow/ReportCreateContext'
import {ReportFlowProvider} from '../../components_feature/reportFlow/ReportFlowContext'
import {RgpdBanner} from '../../components_simple/bigBanners/RgpdBanner'
import {ScFooter} from '../../components_simple/ScFooter'
import {ScHeader} from '../../components_simple/ScHeader'
import {ConfigProvider, useConfig} from '../../context/ConfigContext'
import {appConfig} from '../../core/appConfig'
import '../../globals.css'
import {useI18n} from '../../i18n/I18n'
import {Eularian} from '../../plugins/eularian'
import {Matomo} from '../../plugins/matomo'
import {Sentry} from '../../plugins/sentry'
import {AutoscrollProvider} from '@/context/AutoscrollContext'

monkeyPatchDomForGoogleTranslate()

const queryClient = new QueryClient()

const LayoutCore: ({children}: {children: React.ReactNode}) => JSX.Element = ({children}: {children: React.ReactNode}) => {
  const [analytic, setAnalytic] = useState<Analytic | undefined>()

  useEffect(() => {
    Sentry.init(appConfig)
    const matomo = Matomo.init({siteId: appConfig.matomo_siteId, url: appConfig.matomo_url})
    const eularian = Eularian.init()
    setAnalytic(Analytic.init({matomo, eularian}))
  }, [])

  return (
    <>
      <ApiClientsProvider>
        <QueryClientProvider client={queryClient}>
          <AnalyticProvider analytic={analytic}>
            <ConfigProvider config={appConfig}>
              <ToastProvider>
                <ReportCreateProvider>
                  <ReportFlowProvider>
                    <AutoscrollProvider>
                      <Base>{children}</Base>
                    </AutoscrollProvider>
                  </ReportFlowProvider>
                </ReportCreateProvider>
              </ToastProvider>
            </ConfigProvider>
          </AnalyticProvider>
        </QueryClientProvider>
      </ApiClientsProvider>
      {analytic && <PageChangesListener {...{analytic}} />}
    </>
  )
}

const Base = ({children}: {children: React.ReactNode}) => {
  const {config} = useConfig()
  const {currentLang} = useI18n()
  const pathname = usePathname() ?? ''

  const regexPattern = `^\\/${currentLang}\\/webview\\/`
  const regex = new RegExp(regexPattern)
  const isWebView = regex.test(pathname)

  return (
    <>
      {!config.isDev && (
        <Script
          nonce="eYhD6rb8vLVwXsAmnbKl/Q=="
          id="eulerian-analytics"
          dangerouslySetInnerHTML={{
            __html: `(function(e,a){var i=e.length,y=5381,k='script',s=window,v=document,o=v.createElement(k);for(;i;){i-=1;y=(y*33)^e.charCodeAt(i)}y='_EA_'+(y>>>=0);(function(e,a,s,y){s[a]=s[a]||function(){(s[y]=s[y]||[]).push(arguments);s[y].eah=e;};}(e,a,s,y));i=new Date/1E7|0;o.ea=y;y=i%26;o.async=1;o.src='//'+e+'/'+String.fromCharCode(97+y,122-y,65+y)+(i%1E3)+'.js?2';s=v.getElementsByTagName(k)[0];s.parentNode.insertBefore(o,s);})('wykp.signal.conso.gouv.fr','EA_push');`,
          }}
        />
      )}
      <div className="root">
        {isWebView ? (
          <Box sx={{mt: 1}}>{children}</Box>
        ) : (
          <>
            <SkipLinks
              links={[
                {
                  anchor: '#main-content',
                  label: 'Contenu',
                },
                {
                  anchor: '#fr-footer',
                  label: 'Pied de page',
                },
              ]}
            />
            <ScHeader />
            {children}
            <RgpdBanner />
            <ScFooter />
          </>
        )}
      </div>
    </>
  )
}

export default LayoutCore