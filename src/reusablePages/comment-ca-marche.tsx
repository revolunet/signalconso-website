import {ContentPageContainer} from 'components_simple/ContentPageContainer'
import Head from 'next/head'
import Image from 'next/image'
import {ReactNode} from 'react'
import {useI18n} from '../i18n/I18n'

export const CommentCaMarche = () => {
  const {m} = useI18n() // Utilisez la fonction useI18n pour accéder aux traductions

  return (
    <>
      <Head>
        <title>{m.titleAndDescriptions.commentCaMarche.title}</title>
        <meta name="description" content={m.titleAndDescriptions.commentCaMarche.description} />
      </Head>
      <ContentPageContainer>
        <h1>{m.commentCaMarche.title}</h1>
        <div className="space-y-6">
          <Card img="/image/illustrations/consumer.png" title={m.commentCaMarche.step1.title}>
            <p>{m.commentCaMarche.step1.description1}</p>
            <p>{m.commentCaMarche.step1.description2}</p>
          </Card>
          <Card img="/image/illustrations/report.png" title={m.commentCaMarche.step2.title}>
            <p>{m.commentCaMarche.step2.description1}</p>
            <p>{m.commentCaMarche.step2.description2}</p>
          </Card>
          <Card img="/image/illustrations/company.png" title={m.commentCaMarche.step3.title}>
            <p>{m.commentCaMarche.step3.description1}</p>
            <p>{m.commentCaMarche.step3.description2}</p>
          </Card>
          <Card img="/image/illustrations/dgccrf.png" title={m.commentCaMarche.step4.title}>
            <p>{m.commentCaMarche.step4.description1}</p>
            <p>{m.commentCaMarche.step4.description2}</p>
          </Card>
        </div>
      </ContentPageContainer>
    </>
  )
}

const Card = ({title, img, children}: {title: string; img: string; children?: ReactNode}) => {
  return (
    <div className="flex flex-col-reverse items-center sm:flex-row">
      <div className="mr-2">
        <h2 className="fr-h4">{title}</h2>
        {children}
      </div>
      <div className="shrink-0">
        <Image src={img} alt="illustration" width={200} height={200} priority />
      </div>
    </div>
  )
}
