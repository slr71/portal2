import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
    paddingLeft: theme.spacing(4),
  }
}));

export default function SideBar() {
  const classes = useStyles();

  return (
    <div>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItem>
        <List component="div">
          <ListItem button className={classes.nested}>
            <ListItemText primary="Manage Service Quotas" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Tool Updates" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Maintenance Calendar" />
          </ListItem>
        </List>
        <ListItem button>
        <ListItemIcon>
            <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="Learning" />
        </ListItem>
        <List component="div">
          <ListItem button className={classes.nested}>
            <ListItemText primary="CyVerse Learning" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Getting Started" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Tutorials" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Focus Forum Webinars" />
          </ListItem>
        </List>
        <ListItem button>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Requests" />
        </ListItem>
        <List component="div">
          <ListItem button className={classes.nested}>
            <ListItemText primary="Resource Increase" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Data Store Allocation Increase" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Community Released Data Folders" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="ALL REQUESTS" />
          </ListItem>
        </List>
        <ListItem button>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Workshops" />
        </ListItem>
        <List component="div">
          <ListItem button className={classes.nested}>
            <ListItemText primary="View Workshops" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Create/Manage Workshop" />
          </ListItem>
        </List>
        <ListItem button>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Resources" />
        </ListItem>
        <List component="div">
          <ListItem button className={classes.nested}>
            <ListItemText primary="Policies" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Wiki" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="FAQ" />
          </ListItem>
        </List>
    </div>
  );
}