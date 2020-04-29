import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from "next/link";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ListIcon from '@material-ui/icons/List';
import EventIcon from '@material-ui/icons/Event';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4)
  }
}))

const navButtons = [
  {
    label: "Services",
    icon: <DashboardIcon />,
    items: [
      { label: "Manage Service Quotas" },
      { label: "Tool Updates" },
      { label: "Maintenance Calendar" }
    ]
  },
  {
    label: "Learning",
    icon: <MenuBookIcon />,
    items: [
      { label: "CyVerse Learning" },
      { label: "Getting Started" },
      { label: "Tutorials" },
      { label: "Focus Forum Webinars" }
    ]
  },
  {
    label: "Requests",
    icon: <ListIcon />,
    items: [
      { label: "Resource Increase" },
      { label: "Data Store Allocation Increase" },
      { label: "Community Released Data Folders" },
      { label: "ALL REQUESTS" }
    ]
  },
  {
    label: "Workshops",
    icon: <EventIcon />,
    items: [
      { label: "View Workshops" },
      { label: "Create/Manage Workshop" }
    ]
  },
  {
    label: "Resources",
    icon: <HelpIcon />,
    items: [
      { label: "Policies" },
      { label: "Wiki" },
      { label: "FAQ" }
    ]
  }
]

const NavButton = props => {
  const classes = useStyles()

  return (
    <div>
      <ListItem button>
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.label} />
      </ListItem>
      <List component="div">
        {props.items.map(item => (
          <ListItem button className={classes.nested}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default function SideBar() {
  return (
    <div>
      {navButtons.map(b =>
        <NavButton {...b} />
      )}
    </div>
  )
}