import { Button } from '@material-ui/core'


const ServiceActionButton = ({ status, service, requestAccessHandler }) => {
  // Request status can be: 'granted', 'denied', 'approved', 'pending'
  const [label, action, url, disabled] = (() => {
    if (service.is_powered || status === 'granted')
      return ['LAUNCH', null, service.service_url, false]
    if (status === 'pending' || status === 'approved')
      return ['ACCESS PENDING APPROVAL', null, null, true]
    if (status === 'denied')
      return ['ACCESS DENIED', null, null, true]
    
    return ['REQUEST ACCESS', requestAccessHandler, null, false]
  })()

  return (
    <Button variant="contained" color="primary" size="medium" disabled={disabled} href={url} onClick={action}>
      {label}
    </Button> 
  )
}

export default ServiceActionButton