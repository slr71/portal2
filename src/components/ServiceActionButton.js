import { Button } from '@material-ui/core'


const ServiceActionButton = ({ user, service, requestAccessHandler }) => {
  let label, action, url

  // Request status can be: 'granted', 'denied', 'approved', 'pending'
  if (service.is_powered)
    [label, action, url] = ['LAUNCH', null, service.service_url]
  else {
    const [userService] = user.services.filter(s => s.id == service.id)

    if (!userService || !userService.request)
      [label, action, url] =  ['REQUEST ACCESS', requestAccessHandler, null]
    else if (userService.request.status === 'granted')
      [label, action, url] =  ['LAUNCH', null, service.service_url]
    else if (userService.request.status === 'denied')
      [label, action, url] =  ['DENIED']
    else
      [label, action, url] =  ['PENDING']
  }

  return (
    <Button variant="contained" color="primary" size="medium" href={url} onClick={action}>
      {label}
    </Button> 
  )
}

export default ServiceActionButton