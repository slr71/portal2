import React from 'react'
import Link from "next/link"
import { useRouter } from 'next/router'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { makeStyles } from '../styles/tss'
import { menuItems } from './menuItems'

const useStyles = makeStyles()((theme) => ({
  listItem: {
    marginBottom: '1em',
    color: 'white'
  },
  icon: {
    color: 'white'
  },
  text: {
    color: 'white'
  }
}))

const NavButton = props => {
  const { classes } = useStyles()

  return (
    <div>
      <Link href={props.path} passHref>
        <ListItem button selected={props.selected} className={classes.listItem} component="a">
          <ListItemIcon className={classes.icon}>
            {props.icon}
          </ListItemIcon>
          <ListItemText primary={props.label} className={classes.text} />
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