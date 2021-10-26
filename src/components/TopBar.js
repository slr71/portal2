import { Grid, Box, Breadcrumbs, Link, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { menuItems } from './menuItems.js'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1.5em",
    marginLeft: "0.5em"
  },
  box: {
    borderBottom: "1px solid lightgray",
    height: "3.75em",
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  breadcrumbs: {
    paddingTop: '0.35em',
  }
}))

const BreadcrumbsMenu = ({ parts, title }) => {
  const classes = useStyles()

  if (parts.length <= 1)
    return <></>

  return (
    <Breadcrumbs className={classes.breadcrumbs}>
      {parts.slice(0, -1).map((part, index) => (
        <Link key={index} color="inherit" href={"/" + parts.slice(0,index+1).join("/")}>
          {capitalize(part)}
        </Link>
      ))}
      <Typography color="textPrimary">{title ? title : capitalize(parts.slice(-1)[0])}</Typography>
    </Breadcrumbs>
  )
}

const TopBar = (props) => {
  const classes = useStyles()
  const menuItem = menuItems.find(item => item.label === props.title)

  const parts = useRouter().asPath.split("/").filter(s => s)
  const backUrl = "/" + parts.slice(0, -1).join("/")

  return (
    <Box px={4} pt={1.15} className={classes.box}>
      <Grid container justify="space-between">
        <Grid item>
          {props.back 
            ? <Link color="inherit" href={backUrl}>Back</Link>
            : props.breadcrumbs
              ? <BreadcrumbsMenu parts={parts} title={props.title} />
              : <div style={{display: 'flex', alignItems: 'center'}}>
                  {menuItem && menuItem.icon}
                  <Typography className={classes.title} nowrap='true'>{props.title}</Typography>
                </div>
          }
        </Grid>
        <Grid item>
          {props.actions}
        </Grid>
      </Grid>
    </Box>
  )
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default TopBar