import { Container } from '@material-ui/core'
import { Layout, User as UserComponent } from '../../../components'
import api from '../../../api'

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
  const user = await api.user()
  const targetUser = await api.user(id)

  return { props: { user, targetUser } }
}

export default User