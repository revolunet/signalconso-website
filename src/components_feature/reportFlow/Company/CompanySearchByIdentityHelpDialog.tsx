import * as React from 'react'
import {EventHandler, ReactElement, SyntheticEvent, useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, PaperProps} from '@mui/material'
import {useI18n} from 'i18n/I18n'
import {Txt} from '../../../alexlibs/Txt'
import {AccordionPanel, AccordionPanels} from 'components_simple/AccordionPanel'

export interface ConfirmProps extends Omit<DialogProps, 'children' | 'onClick' | 'open'> {
  children: ReactElement<any>
  onClick?: EventHandler<SyntheticEvent<any>>
  PaperProps?: Partial<PaperProps>
}

export const CompanySearchByIdentityHelpDialog = ({children, PaperProps, onClick, ...props}: ConfirmProps) => {
  const {m} = useI18n()
  const [open, setOpen] = useState<boolean>(false)

  const close = () => setOpen(false)

  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: any) => {
          if (children.props.onClick) children.props.onClick(event)
          if (onClick) onClick(event)
          setOpen(true)
        },
      })}
      <Dialog open={open} {...props} PaperProps={PaperProps}>
        <DialogTitle>{m.companyIdentityHelperTitle}</DialogTitle>
        <DialogContent>
          <Txt size="big" bold block sx={{mb: 1}}>
            {m.companyIdentityHelper}
          </Txt>
          <span dangerouslySetInnerHTML={{__html: m.companyIdentityHelperDesc}} />
          <Txt size="big" bold block sx={{mb: 1}}>
            {m.companyIdentityHelperWhere}
          </Txt>
          {m.companyIdentityHelperWhereDesc}
          <br />
          <br />
          <AccordionPanels sx={{mt: 1}}>
            <AccordionPanel title={m.companyIdentityHelperWebsite}>
              {m.companyIdentityHelperWhereDesc0}
              <img
                src="/image/siret-helper/siret-helper-footer.png"
                alt="Sur un site internet 1 sur 2"
                style={{width: '100%', marginTop: 4, marginBottom: 4}}
              />
              {m.companyIdentityHelperWhereDesc2}
              <img
                src="/image/siret-helper/siret-helper-mentions_legales.png"
                alt="Sur un site internet 2 sur 2"
                style={{width: '100%', marginTop: 4, marginBottom: 4}}
              />
            </AccordionPanel>
            <AccordionPanel title={m.companyIdentityHelperInvoice}>
              <img src="/image/siret-helper/siret-helper-bill.jpg" alt="Sur une facture" style={{width: '100%'}} />
            </AccordionPanel>
            <AccordionPanel title={m.companyIdentityHelperReceipt}>
              <img
                src="/image/siret-helper/siret-helper-ticket.jpg"
                alt="Sur un ticket de caisse"
                style={{maxWidth: '300px', margin: 'auto', display: 'block'}}
              />
            </AccordionPanel>
            <AccordionPanel title={m.companyIdentityHelperCreditCardReceipt}>
              <img
                src="/image/siret-helper/siret-helper-card.jpg"
                alt="Sur un ticket de carte bleue"
                style={{maxWidth: '300px', margin: 'auto', display: 'block'}}
              />
            </AccordionPanel>
          </AccordionPanels>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            {m.close ?? 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}