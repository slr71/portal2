import { Link, Grid } from '@material-ui/core'
import { Layout, SummaryCard } from '../components'
import PortalAPI from '../api'

const Requests = props => (
  <Layout title="Requests" {...props} >
    {props.forms
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
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const forms = await api.forms()

  return { props: { user, forms } }
}

export default Requests