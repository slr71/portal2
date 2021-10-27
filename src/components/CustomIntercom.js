/*
 *  Wrapper component around the Intercom chat widget
 *  Based on Sonora module of same name
 */

import getConfig from "next/config"
import { makeStyles, Badge, Button, IconButton, Tooltip, Hidden } from "@material-ui/core"
import { Person as PersonIcon, LiveHelp as LiveHelpIcon } from "@material-ui/icons"
import { useUser } from '../contexts/user'

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "white",
  }
}))

function CustomIntercom() {
  const config = getConfig().publicRuntimeConfig
  if (!config.INTERCOM_ENABLED) {
    console.warn('Intercom is disabled')
    return <></>
  }
  
  const classes = useStyles()
  const [user] = useUser()
  const [unreadCount, setUnreadCount] = React.useState(0)

  React.useEffect(() => {
    if (typeof window.Intercom === "function") {
      window.Intercom("reattach_activator")
      window.Intercom("update", window.intercomSettings)
      return
    }

    if (!user) { // should never happen
      console.warn('CustomIntercom: missing user')
      return
    }

     // Initialize Intercom chat widget
     // UP-66: moved all initialization code due to race condition between this useEffect hook and the one in _app.js
    window.intercomSettings = {
      app_id: config.INTERCOM_APP_ID,
      alignment: "right",
      hide_default_launcher: true
    }

    // Load Intercom library -- copied from developer docs, modified app ID
    // https://developers.intercom.com/installing-intercom/docs/basic-javascript
    console.log('Initializing Intercom widget')
    var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src=`https://widget.intercom.io/widget/${iconfig.INTERCOM_APP_ID}`;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}

    window.Intercom("boot", {
      app_id: config.INTERCOM_APP_ID,
      email: user.email,
      user_id: user.username,
      created_at: Date.now(),
      company: {
          id: config.INTERCOM_COMPANY_ID,
          //name: companyName,
      }
    })

    window.Intercom(
      "onUnreadCountChange",
      (newUnreadCount) => setUnreadCount(newUnreadCount)
    )
  })

  return (
    <>
      <Hidden xsDown implementation="css">
        <Tooltip title="Chat with CyVerse Support">
          <Button
            variant="text"
            color="inherit"
            size="large"
            startIcon={<Badge badgeContent={unreadCount} color="error"><LiveHelpIcon /></Badge>}
            onClick={intercomShow}
          >
            Help
          </Button>
        </Tooltip>
      </Hidden>
      <Hidden smUp implementation="css">
        <IconButton onClick={intercomShow}>
          <PersonIcon className={classes.icon} />
        </IconButton>
      </Hidden>
    </>
  )
}

function intercomShow() {
  if (window.Intercom)
    window.Intercom("show")
}

export { CustomIntercom, intercomShow }
