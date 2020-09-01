import { Grid, Link, Box } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import { getMenuItem } from '../menuItems.js'

const Support = () => {
  const menuItem = getMenuItem('Support')

  return (
    <Layout title='Support'>
      <Box mt={4}>
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
      </Box>
    </Layout>
  )
}

//FIXME this is required to prevent "useUser must be used within a UserProvider" error, not sure why
export async function getServerSideProps() {
  return { props: {} }
}

export default Support