import { Grid, Link, Box } from '@material-ui/core'
import { Layout, SummaryCard, intercomShow, getMenuItem } from '../components'

const Support = () => {
  const menuItem = getMenuItem('Support')

  const chatLink = 
    <Link onClick={intercomShow}>
      Need help? Click here to chat live with CyVerse Support!
    </Link>

  return (
    <Layout title='Support' actions={chatLink}>
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

export default Support