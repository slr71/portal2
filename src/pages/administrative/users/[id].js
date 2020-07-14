import fetch from 'isomorphic-unfetch'
import { Container } from '@material-ui/core'
import { Layout, User as UserComponent } from '../../../components'
import { apiBaseUrl } from '../../../config.json'

const User = props => (
  <Layout {...props}>
    <Container maxWidth='lg'>
        <UserComponent 
          user={props.targetUser}
          allSections
        />
    </Container>
  </Layout>
)

export async function getServerSideProps(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/users/${id}`)
  const targetUser = await res.json()

  return { props: { user, targetUser } }
}

export default User