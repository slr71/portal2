import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import { Container } from '@material-ui/core'
import { Layout, User as UserComponent } from '../../../components'
import { apiBaseUrl } from '../../../config.json'

const User = props => (
  <Layout {...props}>
    <Container maxWidth='lg'>
        <UserComponent user={props.targetUser} />
    </Container>
  </Layout>
)

User.getInitialProps = async function(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/users/${id}`)
  const targetUser = await res.json()

  return { user, targetUser }
}

export default User