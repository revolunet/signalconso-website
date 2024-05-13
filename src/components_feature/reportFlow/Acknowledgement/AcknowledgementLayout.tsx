"use client"
import React, {ReactNode} from 'react';
import {externalLinks} from '@/core/externalLinks' // Specify the path to the company logo or relevant image
import {useI18n} from '@/i18n/I18n'
import imgCompany from '@/img/illustrations/company.png'
import Image from 'next/image'
import {LinkBackToHome} from '../../../components_simple/LinkBackToHome'
import {appConfig} from "@/core/appConfig";
import {CreatedReport} from "@/model/CreatedReport";
import {ReportDraft2} from "@/model/ReportDraft2";
import {useReportFlowContext} from "@/components_feature/reportFlow/ReportFlowContext";

interface AcknowledgementLayoutProps {
  title?: string;
  children: ReactNode;
  showChargeBack?: boolean;
  isWebView: boolean;
  createdReport: CreatedReport;
}

const AcknowledgementLayout: React.FC<AcknowledgementLayoutProps> = ({
                                                                       title,
                                                                       children,
                                                                       showChargeBack = false, // default value for optional prop
                                                                       isWebView,
                                                                       createdReport
                                                                     }) => {
  const {m, currentLang} = useI18n()

  return (
    <>
      <Image src={imgCompany} alt="" className="block mx-auto"/>

      <div className="max-w-3xl mx-auto">
        <h2>
          <div className="flex items-center">
            <i className="ri-checkbox-circle-fill mr-2"/>
            <span dangerouslySetInnerHTML={{__html: m.acknoledgment.sentReport}}/>
          </div>
        </h2>
        {title && <h3 className="fr-h5 !text-scbluefrance">{title}</h3>}
        {children}

        {createdReport.postReportHelper && (
          <p>
            {createdReport.postReportHelper.title &&
              <h3 className="fr-h5 !text-scbluefrance">{createdReport.postReportHelper.title}</h3>}
            {createdReport.postReportHelper.content &&
              <span dangerouslySetInnerHTML={{__html: createdReport.postReportHelper.content}}/>}

          </p>
        )}

        {showChargeBack && (
          <>
            <p>
            <strong>{m.acknoledgment.paidWithCreditCard}</strong>
            </p>
            <p>
              {m.acknoledgment.chargeBack}
              <br/>
              <a href={externalLinks.chargeBack}>{externalLinks.chargeBack}</a>
            </p>
          </>
        )}
        <p className="mb-14">
          {m.acknoledgment.emailForErrorInReport}

          <a href={`mailto:${appConfig.contactEmail}?subject=incident`} className="text-scbluefrance">
            {appConfig.contactEmail}
          </a>
        </p>
        <LinkBackToHome isWebView={isWebView} lang={currentLang}/>
      </div>
    </>
  )
};


export default AcknowledgementLayout;
