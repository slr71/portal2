import { Container } from '@material-ui/core'
import { Layout, User as UserComponent } from '../../../components'
import PortalAPI from '../../../api'

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

export async function getServerSideProps({ req, query }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const targetUser = await api.user(query.id)

  return { props: { user, targetUser } }
}

export default User