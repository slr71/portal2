/*
 *  Wrapper component around the Intercom chat widget
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
    if (!user) {// should never happen
      console.warn('CustomIntercom: missing user')
      return
    }

     // Initialize Intercom chat widget
     // UP-66: moved all initialization code due to race condition between this useEffect hook and the one in _app.js
    if (!window.Intercom) {
      window.intercomSettings = {
        app_id: config.intercom.appId,
        alignment: "right",
        hide_default_launcher: true
      }

      // Load Intercom library -- copied from developer docs, modified app ID
      // https://developers.intercom.com/installing-intercom/docs/basic-javascript
      console.log('Initializing Intercom widget')
      var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src=`https://widget.intercom.io/widget/${config.intercom.appId}`;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}
    }

    window.Intercom("boot", {
      app_id: config.intercom.appId,
      email: user.email,
      user_id: user.username,
      created_at: Date.now(),
      company: {
          id: config.intercom.companyId,
          //name: companyName,
      }
    })

    window.Intercom(
      "onUnreadCountChange",
      (newUnreadCount) => setUnreadCount(newUnreadCount)
    )

    return () => {
      intercomLogout()
    }
  })

  return (
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
