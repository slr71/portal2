import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  medium: {
    width: '13em'
  },
  large: {
    width: '30vw'
  }
}))

export default function MainLogo({ size }) {
  return <img src="/cyverse_upLogo_white.svg" alt="CyVerse Logo" className={useStyles()[size]} />
}