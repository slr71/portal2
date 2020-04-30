import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json'

const useStyles = makeStyles((theme) => ({
  large: {
    width: '5em',
    height: '5em'
  }
}))

const Service = props => {
  const service = props.service
  const classes = useStyles()

  return (
    <Layout>
      <Container maxWidth='md'>
        <Box display="flex">
          <Avatar alt={service.name} src={service.icon_url} />
          <h1>{service.name}</h1>
        </Box>
        <Box>
          {service.description}
        </Box>
      </Container>
    </Layout>
  )
}

Service.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(apiBaseUrl + `/services/${id}`)
  const service = await res.json()

  return { service }
}

export default Service