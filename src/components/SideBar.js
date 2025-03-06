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
  },
  selected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    borderLeft: '4px solid white',
    paddingLeft: '12px',
  },
  selectedIcon: {
    color: 'white',
    minWidth: '46px', // Adjust this value to compensate for the border
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  }
}))

const NavButton = props => {
  const { classes } = useStyles()
  const isSelected = props.selected

  return (
    <div>
      <Link href={props.path} passHref>
        <ListItem 
          button 
          component="a"
          className={`${classes.listItem} ${isSelected ? classes.selected : ''}`}
        >
          <ListItemIcon className={isSelected ? classes.selectedIcon : classes.icon}>
            {props.icon}
          </ListItemIcon>
          <ListItemText 
            primary={props.label} 
            className={isSelected ? classes.selectedText : classes.text} 
          />
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