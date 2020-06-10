import { Box, Tabs, Tab, Breadcrumbs, Link, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import menuItems from '../menuItems.js'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1.5em",
    marginLeft: ".5em"
  },
  box: {
    borderBottom: "1px solid lightgray",
    minHeight: "4.5em"
  }
}))

const TabMenu = props => {
  return (
    <Tabs
      value={0}
      indicatorColor="primary"
      textColor="primary"
      aria-label="disabled tabs example"
      centered
    >
      {props.items.map(item => (
        <Tab key={item.label} label={item.label} value={item.path} />
      ))}
    </Tabs>
  )
}

const BreadcrumbsMenu = props => {
  const parts = useRouter().asPath.split("/").filter(s => s)
  console.log(parts)

  if (parts.length <= 1) {
    return <></>
  }

  return (
    <Breadcrumbs>
      {parts.slice(0, -1).map((part, index) => (
        <Link key={index} color="inherit" href={"/" + parts.slice(0,index-1).join("/")}>
          {capitalize(part)}
        </Link>
      ))}
      <Typography color="textPrimary">{capitalize(parts.slice(-1)[0])}</Typography>
    </Breadcrumbs>
  )
}

const TopBar = props => {
  const menuItem = menuItems.filter(item => item.label === props.title)[0]

  return (
    <Box display="flex" p={1} className={useStyles().box}>
      {menuItem && menuItem.icon}
      <Typography className={useStyles().title}>{props.title}</Typography>
      {menuItem && menuItem.items ? <TabMenu items={menuItem.items}/> : <></>}
      <BreadcrumbsMenu />
    </Box>
  )
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default TopBar