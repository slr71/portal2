import { 
  Dashboard as DashboardIcon, 
  List as ListIcon, 
  Event as EventIcon, 
  Help as HelpIcon, 
  Lock as LockIcon,
  Group as GroupIcon,
  Block as BlockIcon,
  PersonAdd as PersonAddIcon,
  Computer as ComputerIcon,
  Edit as EditIcon,
  Inbox as InboxIcon
} from '@material-ui/icons'



const menuItems = [
  {
    label: "Services",
    icon: <DashboardIcon fontSize="large"/>,
    path: "/services",
    items: []
    // items: [
    //   { label: "Manage Service Quotas", path: "/services/quotas" },
    //   { label: "Maintenance Calendar", path: "/services/calendar" }
    // ]
  },
  {
    label: "Requests",
    icon: <ListIcon fontSize="large" />,
    path: "/requests",
    items: []
  },
  {
    label: "Workshops",
    icon: <EventIcon fontSize="large" />,
    path: "/workshops",
    items: []
  },
  {
    label: "Support",
    icon: <HelpIcon fontSize="large" />,
    path: "/support",
    items: [
      { label: "Getting Started", 
        path: "https://learning.cyverse.org",
        description: "Help on creating account and learning what services are available."
      },
      { label: "Tutorials", 
        path: "https://learning.cyverse.org/en/latest/tutorials.html",
        description: "Tutorials covering CyVerse services."
      },
      { label: "Focus Forum Webinars", 
        path: "https://learning.cyverse.org/en/latest/webinars.html",
        description: "Upcoming webinars on how to use CyVerse services."
      },
      { label: "Policies", 
        path: "https://cyverse.org/policies",
        description: "CyVerse policies that apply to all users."
      },
      { label: "Wiki", 
        path: "https://cyverse.atlassian.net/wiki",
        description: "A space for collaboration."
      },
      { label: "FAQ", 
        path: "https://learning.cyverse.org/projects/faq",
        description: "Answers to frequenty asked questions about CyVerse"
      }
    ]
  },
  {
    label: "Administrative",
    icon: <LockIcon fontSize="large" />,
    path: "/administrative",
    restricted: true,
    items: [
      { label: "Users",
        icon: <GroupIcon fontSize="medium"/>,
        path: "/administrative/users",
        description: "Search across all CyVerse users and view details about individual users."
      },
      { label: "Restricted Usernames",
        icon: <BlockIcon fontSize="medium"/>, 
        path: "/administrative/usernames",
        description: "Show and edit restricted usernames."
      },
      { label: "Access Requests",
        icon: <PersonAddIcon fontSize="medium" />,
        path: "/administrative/requests",
        description: "Search across all access requests and view/deny/approve individual requests."
      },
      { label: "Services",
        icon: <DashboardIcon fontSize="medium" />, 
        path: "/administrative/services",
        description: "View and modify services."
      },
      { label: "Workshops",
        icon: <EventIcon fontSize="medium" />, 
        path: "/administrative/workshops",
        description: "View, create, and modify workshops."
      },
      { label: "Form Submissions", 
        icon: <InboxIcon fontSize="medium" />,
        path: "/administrative/submissions",
        description: "Search across all form submissions and view individual submissions."
      },
      { label: "Manage Forms",
        icon: <EditIcon fontSize="medium" />, 
        path: "/administrative/forms",
        description: "View and edit forms."
      }
    ]
  }
]

const getMenuItem = (label) => {
  return menuItems.find(item => item.label === label)
}

export { menuItems, getMenuItem }