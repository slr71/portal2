import React from 'react'
import Link from "next/link"
import { useRouter } from 'next/router'
import { ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import { menuItems } from './menuItems'

const useStyles = makeStyles((theme) => ({
  // nested: {
  //   paddingLeft: theme.spacing(4)
  // }
  listItem: {
    marginBottom: '1em'
  }
}))

const NavButton = props => {
  const classes = useStyles()

  // let subMenu = <></> 
  // if (props.open) {
  //   subMenu = (
  //     <List component="div">
  //       {props.items.map(item => (
  //         <Link key={item.path} href={item.path}>
  //           <ListItem button className={classes.nested}>
  //             <ListItemText primary={item.label} />
  //           </ListItem>
  //         </Link>
  //       ))}
  //     </List>
  //   )
  // }

  return (
    <div>
      <Link href={props.path}>
        <ListItem button selected={props.selected} className={classes.listItem}>
          <ListItemIcon>
            {props.icon}
          </ListItemIcon>
          <ListItemText primary={props.label} />
        </ListItem>
      </Link>
      {/* {subMenu} */}
    </div>
  )
}

export default function SideBar(props) {
  const route = useRouter().route
  const navItems = menuItems.filter(item => !item.restricted || props.showStaff)

  return (
    <div>
      {navItems.map(item =>
        <NavButton key={item.path} {...props} {...item} selected={route.startsWith(item.path)} />
      )}
    </div>
  )
}