import { Container } from '@material-ui/core'
import { Layout, User as UserComponent } from '../../../components'

const User = props => (
  <Layout>
    <Container maxWidth='lg'>
        <br />
        <UserComponent 
          user={props.targetUser}
          allSections
        />
    </Container>
  </Layout>
)

export async function getServerSideProps({ req, query }) {
  const targetUser = await req.api.user(query.id)

  return { props: { targetUser } }
}

export default User