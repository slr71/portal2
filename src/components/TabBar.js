import { Box, Tabs, Tab, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import menuItems from '../menuItems.js'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "1.5em",
    marginLeft: ".5em"
  },
  box: {
    borderBottom: "1px solid lightgray"
  }
}))

const TabBar = props => {
  const menuItem = menuItems.filter(item => item.label === props.title)[0]

  return (
    <Box display="flex" p={1} className={useStyles().box}>
      {menuItem && menuItem.icon}
      <Typography className={useStyles().title}>{props.title}</Typography>
      <Tabs
        value={0}
        indicatorColor="primary"
        textColor="primary"
        aria-label="disabled tabs example"
        centered
      >
        {menuItem && menuItem.items && menuItem.items.map(item => (
          <Tab key={item.label} label={item.label} value={item.path} />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabBar