import { Link, Grid } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'

const Requests = ({ forms }) => (
  <Layout title="Requests">
    {forms
      .filter(formGroup => formGroup.forms.length > 0)
      .map(formGroup => (
        <div key={formGroup.name}>
          <h2>{formGroup.name}</h2>
          <div>{formGroup.description}</div>
          <br />
          <RequestGrid forms={formGroup.forms} />
        </div>
    ))}
  </Layout>
)

const RequestGrid = ({ forms }) => (
  <Grid container spacing={3}>
    {forms.map(form =>
      <Grid item xs={6} key={form.id}>
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
    />
  </Link>
)

export async function getServerSideProps({ req }) {
  const forms = await req.api.forms()
  return { props: { forms } }
}

export default Requests