import { Dashboard as DashboardIcon, MenuBook as MenuBookIcon, List as ListIcon, Event as EventIcon, Help as HelpIcon, Lock as LockIcon } from '@material-ui/icons'

const menuItems = [
  {
    label: "Services",
    icon: <DashboardIcon fontSize="large" />,
    path: "/services",
    items: []
    // items: [
    //   { label: "Manage Service Quotas", path: "/services/quotas" },
    //   { label: "Maintenance Calendar", path: "/services/calendar" }
    // ]
  },
  {
    label: "Learning",
    icon: <MenuBookIcon fontSize="large" />,
    path: "/learning",
    items: [
      { label: "Getting Started", path: "/learning/getting_started"  },
      { label: "Tutorials", path: "/learning/tutorials"  },
      { label: "Focus Forum Webinars", path: "/learning/webinars"  }
    ]
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
    label: "Resources",
    icon: <HelpIcon fontSize="large" />,
    path: "/resources",
    items: [
      { label: "Policies", path: "/resources/policies" },
      { label: "Wiki", path: "/resources/wiki" },
      { label: "FAQ", path: "/resources/faq" }
    ]
  },
  {
    label: "Administrative",
    icon: <LockIcon />,
    path: "/administrative",
    items: [
      { label: "Users", path: "/administrative/users" },
      { label: "Restricted Usernames", path: "/administrative/usernames" },
      { label: "Access Requests", path: "/administrative/requests" },
      { label: "Form Submissions", path: "/administrative/submissions" },
      { label: "Manage Forms", path: "/administrative/forms" }
    ],
    restricted: true
  }
]

export default menuItems