import {FacebookIcon, TwitterIcon} from 'mui-extension/lib'
import {alpha, Box, Grid, Theme, useTheme} from '@mui/material'
import Link from 'next/link'
import {SxProps} from '@mui/system'

const sxList: SxProps<Theme> = {
  listStyle: 'none',
  mb: 1,
  '& > li': {
    color: t => alpha(t.palette.secondary.contrastText, .7),
    transition: t => t.transitions.create('all'),
    mb: 1,
    '&:hover': {
      color: t => t.palette.secondary.contrastText,
    }
  }
}

const iconHeight = 34

export const Footer = () => {
  const theme = useTheme()
  return (
    <>
      {/*<Box sx={{*/}
      {/*  height: 8 * 3,*/}
      {/*  borderTopLeftRadius: '50%',*/}
      {/*  borderTopRightRadius: '50%',*/}
      {/*  background: theme.palette.secondary.main,*/}
      {/*}}>*/}
      {/*</Box>*/}
      <footer style={{
        padding: theme.spacing(3),
        // paddingTop: 0,
        background: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
      }}>
        <section className="section-small bg-secondary">
          <Grid container>
            <Grid item md={4}>
              <Box component="h3" sx={{m: 0, fontSize: 24,}}>SignalConso</Box>
              <a
                style={{
                  color: alpha(theme.palette.secondary.contrastText, .7),
                }}
                href="https://www.economie.gouv.fr/dgccrf"
                target="_blank"
                rel="noreferrer"
                title="Un service proposé par la DGCCRF (nouvelle fenêtre)"
              >
                Un service proposé par la <abbr title="Direction Général de la Concurrence, Consommation et Répression des Fraudes">DGCCRF</abbr>
              </a>
              <Box component="ul" sx={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                '& > li': {
                  transition: t => t.transitions.create('all'),
                  opacity: .6,
                  mr: 2,
                  '&:hover': {
                    opacity: 1,
                  }
                }
              }}>
                <li>
                  <a href="https://twitter.com/SignalConso"
                     target="_blank"
                     rel="noreferrer"
                     title="Retrouvez-nous sur Twitter (nouvelle fenêtre)"
                  >
                    <TwitterIcon title="Twitter" style={{width: iconHeight, height: iconHeight}}/>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/SignalConso/"
                    target="_blank"
                    rel="noreferrer"
                    title="Retrouvez-nous sur Facebook (nouvelle fenêtre)"
                  >
                    <FacebookIcon title="Facebook" style={{width: iconHeight, height: iconHeight}}/>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.economie.gouv.fr/dgccrf"
                    target="_blank"
                    rel="noreferrer"
                    title="Accédez au site de la DGCCRF (nouvelle fenêtre)"
                  >
                    <img
                      style={{borderRadius: 2, height: iconHeight}}
                      alt="Logo de la Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes"
                      src="/image/logo-dgccrf.png"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li>
                  <a href="https://www.plus.transformation.gouv.fr/" target="_blank"
                     rel="noreferrer"
                     title="Accédez au site de la Direction interministérielle de la transformation publique (nouvelle fenêtre)"
                  >
                    <img
                      style={{borderRadius: 2, height: iconHeight}}
                      alt="Logo de la Direction interministérielle de la transformation publique"
                      src="/image/service-publics.png"
                      loading="lazy"
                    />
                  </a>
                </li>
              </Box>
            </Grid>
            <Grid item md={4}>
              <Box component="ul" sx={sxList}>
                <li>
                  <Link href="/suivi-et-vie-privee">
                    <a>Suivi d'audience et vie privée</a>
                  </Link>
                </li>
                <li>
                  <Link href="/cookies">
                    <a>Gestion des cookies</a>
                  </Link>
                </li>
                <li>
                  <Link href="/conditions-generales-utilisation/consommateur">
                    <a title="Conditions générales d'utilisation (nouvelle fenêtre)" target="_blank">
                      Conditions générales d'utilisation
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/accessibilite">
                    <a title="Accessibilité">Accessibilité (partiellement conforme)</a>
                  </Link>
                </li>
                <li>
                  <Link href="/plan-du-site">
                    <a title="Plan du site">Plan du site</a>
                  </Link>
                </li>
              </Box>
            </Grid>
            <Grid item md={4}>
              <Box component="ul" sx={sxList}>
                <li>
                  <Link href="/qui-sommes-nous">
                    <a>Qui sommes-nous ?</a>
                  </Link>
                </li>
                <li>
                  <Link href="/dgccrf">
                    <a>Espace DGCCRF</a>
                  </Link>
                </li>
                <li>
                  <Link href="/stats">
                    <a>Statistiques</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a>Contact</a>
                  </Link>
                </li>
              </Box>
            </Grid>
          </Grid>
        </section>
      </footer>
    </>
  )
}
