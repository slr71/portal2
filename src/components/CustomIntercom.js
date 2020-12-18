/*
 *  Based on Sonora module of same name
 */

import { Badge, Button, Tooltip, } from "@material-ui/core"
import LiveHelpIcon from "@material-ui/icons/LiveHelp"
import { useUser } from '../contexts/user'
import config from '../config.json'

function CustomIntercom() {
  const [user] = useUser()
  const [unreadCount, setUnreadCount] = React.useState(0)

  React.useEffect(() => {
    if (!user || !window.Intercom) // should never happen
      return

    window.Intercom("boot", {
      app_id: config.intercom.appId,
      email: user.email,
      user_id: user.username,
      created_at: Date.now(),
      company: {
          id: config.intercom.companyId,
          //name: companyName,
      },
    })

    window.Intercom(
      "onUnreadCountChange",
      (newUnreadCount) => setUnreadCount(newUnreadCount)
    )
  })

  const handleClick = () => {
    window.Intercom('show')
  }

  return (
    <Tooltip title="Chat with CyVerse Support">
      <Button
        variant="text"
        color="inherit"
        size="large"
        startIcon={<Badge badgeContent={unreadCount} color="error"><LiveHelpIcon /></Badge>}
        onClick={handleClick}
      >
        Help
      </Button>
    </Tooltip>
  )
}

function intercomLogout() {
  console.log("intercom logging out")
  if (window.Intercom)
    window.Intercom("shutdown")
}

function intercomShow() {
  if (window.Intercom)
    window.Intercom("show")
}

export { CustomIntercom, intercomShow }
