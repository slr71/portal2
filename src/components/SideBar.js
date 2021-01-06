import React from 'react'
import Link from "next/link"
import { useRouter } from 'next/router'
import { ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import { menuItems } from './menuItems'

const useStyles = makeStyles((theme) => ({
  listItem: {
    marginBottom: '1em'
  }
}))

const NavButton = props => {
  const classes = useStyles()

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