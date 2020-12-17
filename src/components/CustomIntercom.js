/**
 *  Based on Sonora module of same name 10/2/2020
 * 
 */

import { Badge, Button, IconButton, Tooltip, useTheme } from "@material-ui/core"
import LiveHelpIcon from "@material-ui/icons/LiveHelp"
import { useUser } from '../contexts/user'
import config from '../config.json'

function CustomIntercom(props) {
    const theme = useTheme()
    const [user] = useUser()

    React.useEffect(() => {
        if (user) {
            intercomLogin(
                user.username,
                user.email,
                config.intercom.appId,
                config.intercom.companyId,
                // config.intercom.companyName
            )

            // return () => {
            //     intercomLogout()
            // }
        }
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
          startIcon={<LiveHelpIcon />}
          onClick={handleClick}
        >
          Help
        </Button>
        {/* <IconButton
          // style={{ color: theme.palette.primary.contrastText }}
          onClick={handleClick}
        >
          <Badge>
            <LiveHelpIcon fontSize='large' style={{fill: 'white'}} />
          </Badge>
        </IconButton> */}
      </Tooltip>
    )
}

function intercomLogin(userId, email, appId, companyId, companyName) {
  if (window.Intercom) {
      window.Intercom("boot", {
          app_id: appId,
          email: email,
          user_id: userId,
          created_at: Date.now(),
          company: {
              id: companyId,
              name: companyName,
          },
      })
  }
}

function intercomLogout() {
  console.log("intercom logging out")
  if (window.Intercom) {
      window.Intercom("shutdown")
  }
}

function intercomShow() {
  if (window.Intercom) {
      window.Intercom("show")
  }
}

export { CustomIntercom, intercomShow }
