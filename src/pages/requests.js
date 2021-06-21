import { Link, Box, Grid, Divider, Typography } from '@material-ui/core'
import { List as ListIcon } from '@material-ui/icons'
import { Layout, SummaryCard } from '../components'
import { withGetServerSideError } from '../contexts/error'

const Requests = ({ forms }) => (
  <Layout title="Requests">
    {forms
      .filter(formGroup => formGroup.forms.length > 0)
      .map((formGroup, index) => (
        <Box key={index} mt={3}>
          <Typography variant="h6" component="h2">{formGroup.name}</Typography>
          {/* <Typography variant="subtitle1">{formGroup.description}</Typography> */}
          <Divider />
          <br />
          <RequestGrid forms={formGroup.forms.filter(f => f.is_public)} />
          <br />
        </Box>
    ))}
  </Layout>
)

const RequestGrid = ({ forms }) => (
  <Grid container spacing={4}>
    {forms.map((form, index) =>
      <Grid item key={index} xs={12} sm={12} md={6} lg={6} xl={3}>
        <Request form={form} />
      </Grid>
    )}
  </Grid>
)

const Request = ({ form }) => (
  <Link underline='none' href={`requests/${form.id}`}>
    <SummaryCard 
      title={form.name} 
      description={form.description} 
      icon={<ListIcon />}
    />
  </Link>
)

export async function getServerSideProps({ req }) {
  const forms = await req.api.forms()
  return { props: { forms } }
}

export default Requests