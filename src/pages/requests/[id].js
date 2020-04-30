import fetch from 'isomorphic-unfetch'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Layout from '../../components/Layout.js'
import { apiBaseUrl } from '../../config.json'

const Request = props => {
  const request = props.request

  return (
    <Layout>
      <Container maxWidth='md'>
        <Box display="flex">
          <h1>{request.name}</h1>
        </Box>
        <Box>
          {request.description}
        </Box>
      </Container>
    </Layout>
  )
}

Request.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(apiBaseUrl + `/requests/${id}`)
  const request = await res.json()

  return { request }
}

export default Request