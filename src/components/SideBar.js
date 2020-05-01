import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from "next/link"
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import ListIcon from '@material-ui/icons/List'
import EventIcon from '@material-ui/icons/Event'
import HelpIcon from '@material-ui/icons/Help'

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4)
  }
}))

const navButtons = [
  {
    label: "Services",
    icon: <DashboardIcon />,
    path: "/services",
    items: [
      { label: "Manage Service Quotas", path: "services/quotas" },
      { label: "Tool Updates", path: "services/updates" },
      { label: "Maintenance Calendar", path: "services/calendar" }
    ]
  },
  {
    label: "Learning",
    icon: <MenuBookIcon />,
    path: "/learning",
    items: [
      { label: "CyVerse Learning", path: "learning/cyverse"  },
      { label: "Getting Started", path: "learning/getting_started"  },
      { label: "Tutorials", path: "learning/tutorials"  },
      { label: "Focus Forum Webinars", path: "learning/webinars"  }
    ]
  },
  {
    label: "Requests",
    icon: <ListIcon />,
    path: "/requests",
    items: [
      { label: "Resource Increase", path: "requests/resource" },
      { label: "Data Store Allocation Increase", path: "requests/allocation" },
      { label: "Community Released Data Folders", path: "requests/community_data" }
    ]
  },
  {
    label: "Workshops",
    icon: <EventIcon />,
    path: "/workshops",
    items: [
      { label: "View Workshops", path: "workshops/all" },
      { label: "Create/Manage Workshop", path: "workshops/manage" }
    ]
  },
  {
    label: "Resources",
    icon: <HelpIcon />,
    path: "/resources",
    items: [
      { label: "Policies", path: "resources/policies" },
      { label: "Wiki", path: "resources/wiki" },
      { label: "FAQ", path: "resources/faq" }
    ]
  }
]

const NavButton = props => {
  const classes = useStyles()

  return (
    <div>
      <Link href={props.path}>
        <ListItem button>
          <ListItemIcon>
            {props.icon}
          </ListItemIcon>
          <ListItemText primary={props.label} />
        </ListItem>
      </Link>
      <List component="div">
        {props.items.map(item => (
          <Link key={item.path} href={item.path}>
            <ListItem button className={classes.nested}>
              <ListItemText primary={item.label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  )
}

export default function SideBar() {
  return (
    <div>
      {navButtons.map(b =>
        <NavButton key={b.path} {...b} />
      )}
    </div>
  )
}