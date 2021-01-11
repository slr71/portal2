import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  medium: {
    width: '13em',
    [theme.breakpoints.down('xs')]: {
      width:'9em',},
  },
  large: {
    width: '55%'
  }
}))

export default function MainLogo({ size }) {
  return <img src="/cyverse_upLogo_white.svg" alt="CyVerse User Portal" className={useStyles()[size]} />
}