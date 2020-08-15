import { Grid, Link } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import menuItems from '../menuItems.js'
import PortalAPI from '../api'

const Administrative = props => {
  const title = "Administrative"
  const menuItem = menuItems.find(item => item.label === title)

  return (
    <Layout title={title} {...props}>
      <Grid container spacing={4}>
        {menuItem.items.map(item =>
          <Grid item xs={4} key={item.path}>
            <Link underline='none' href={item.path}>
              <SummaryCard 
                title={item.label} 
                description={item.description} 
              />
            </Link>
          </Grid>
        )}
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context

  return { props: { user } }
}

export default Administrative