import {UploadedFile} from '@signal-conso/signalconso-api-sdk-js'
import {Box, Icon, Tooltip} from '@mui/material'
import {extensionToType, FileType, reportFileConfig} from './reportFileConfig'
import {some} from 'fp-ts/lib/Option'
import React from 'react'
import {IconBtn, useToast} from 'mui-extension/lib'
import {useI18n} from '../../core/i18n'
import {appConfig} from '../../conf/appConfig'
import {useApiSdk} from '../../core/context/ApiSdk'
import {ScDialog} from '../Dialog/ScDialog'

export interface ReportFileProps {
  file: UploadedFile
  dense?: boolean
  onRemove?: (file: UploadedFile) => void
}

const removeBtnSize = 30
const cardMargin = 1

export const ReportFile = ({file, dense, onRemove}: ReportFileProps) => {
  const fileType = extensionToType(file.filename)
  const {apiSdk} = useApiSdk()
  // const _remove = useFetcher(apiSdk.secured.document.remove)
  const {toastError} = useToast()
  const {m} = useI18n()

  const fileUrl = some(apiSdk.document.getLink(file))
    .map(_ => (appConfig.isDev ? _.replace(appConfig.apiBaseUrl, 'https://signal-api.conso.gouv.fr') : _))
    .toUndefined()

  const remove = async () => {
    // await _remove.fetch({}, file)
    onRemove?.(file)
  }

  // useEffect(() => {
  //   fromNullable(_remove.error).map(toastError)
  // }, [_remove.error])

  return (
    <Tooltip title={file.filename}>
      <Box
        component="a"
        target="_blank"
        href={fileUrl}
        rel="noreferrer"
        sx={{
          display: 'block',
          position: 'relative',
          p: cardMargin,
          '&:hover > $removeBtn': {
            display: 'flex !important',
          },
        }}
      >
        <Box sx={{
          display: 'inline-flex',
          border: t => '1px solid ' + t.palette.divider,
          borderRadius: reportFileConfig.cardBorderRadius + 'px',
          height: reportFileConfig.cardSize,
          width: reportFileConfig.cardSize,
          color: t => t.palette.text.disabled,
          overflow: 'hidden',
          position: 'relative',
          transition: t => t.transitions.create('all'),
          '&:hover': {
            boxShadow: t => t.shadows[4],
          },
          '& > div': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: 'cover',
            height: '100%',
            width: '100%',
          },
        }}>
          {(() => {
            switch (fileType) {
              case FileType.Image: {
                return (
                  <div>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                      backgroundSize: 'cover',
                      backgroundImage: `url(${fileUrl})`
                    }}/>
                    <Icon sx={{color: '#00b50f'}}>image</Icon>
                  </div>
                )
              }
              case FileType.PDF: {
                return (
                  <div>
                    <Icon sx={{color: '#db4537'}}>picture_as_pdf</Icon>
                  </div>
                )
              }
              case FileType.Doc: {
                return (
                  <div>
                    <Icon sx={{color: '#4185f3'}}>article</Icon>
                  </div>
                )
              }
              default: {
                return (
                  <div>
                    <Icon>insert_drive_file</Icon>
                  </div>
                )
              }
            }
          })()}
        </Box>
        {onRemove && (
          // eslint-disable-next-line react/jsx-no-undef
          <ScDialog
            title={m.removeAsk}
            content={<span dangerouslySetInnerHTML={{__html: m.thisWillBeRemoved(file.filename)}} />}
            maxWidth="xs"
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onConfirm={(event, close) => {
              remove()
              close()
            }}
            confirmLabel={m.delete}
          >
            <IconBtn size="small" sx={{
              display: 'none !important',
              position: 'absolute',
              top: (removeBtnSize - 8 * cardMargin) / -2,
              right: (removeBtnSize - 8 * cardMargin) / -2,
              width: removeBtnSize,
              height: removeBtnSize,
              borderRadius: removeBtnSize + 'px',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: t => t.shadows[4],
              background: t => t.palette.background.paper + ' !important',
            }}>
              <Icon>clear</Icon>
            </IconBtn>
          </ScDialog>
        )}
      </Box>
    </Tooltip>
  )
}
