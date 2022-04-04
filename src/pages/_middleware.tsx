import type {NextFetchEvent, NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {ProxyLegacyUrl} from '../core/proxyLegacyUrl'
import {appConfig} from '../conf/appConfig'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const {pathname} = req.nextUrl
  const match = ProxyLegacyUrl.findMatch(pathname)
  console.log('middleware', match, match ? appConfig.dashboardBaseUrl + ProxyLegacyUrl.getRedirection(pathname, match) : undefined)
  if (match) {
    return NextResponse.redirect(appConfig.dashboardBaseUrl + ProxyLegacyUrl.getRedirection(pathname, match))
  }
  return NextResponse.next()
}
