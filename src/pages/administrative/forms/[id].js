import { Container, Box, Paper, Divider, Typography, Button, Tab, Tabs, TextField, FormControlLabel, Checkbox, Grid, makeStyles } from '@material-ui/core'
import { Layout, UpdateForm } from '../../../components'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    height: 224,
    paddingTop: '2em'
  },
  paper: {
    padding: '3em'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const FormEditor = ({ form }) => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const height = form.sections[value].fields.length * 32 + 37

  return (
    <Layout>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper} style={{height: height + "em"}}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography component="h1" variant="h4">{form.name}</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">Edit Name</Button>
              <Button variant="contained" color="secondary">Delete Form</Button>
            </Grid>
          </Grid>
          <div className={classes.root}>
            <Tabs 
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className={classes.tabs}
            >
              {form.sections.map((section, index) => (
                <Tab key={index} label={section.name} />
              ))}
              <Tab label="＋ Add Section"></Tab>
            </Tabs>
            {form.sections.map((section, index) => (
              <SectionTabPanel key={index} value={value} index={index} section={section} />
            ))}
          </div>
        </Paper>
      </Container>
    </Layout>
  )
}

const SectionTabPanel = ({ section, value, index, ...other }) => {
  const classes = useStyles()
  
  return (
    <Box
      p={3}
      flexGrow={1}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <Box mb={5}>
            <Grid container justify="space-between" my={2}>
              <Grid item>
                <Typography component="h1" variant="h5" gutterBottom>Section</Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" size="small">Delete Section</Button>
              </Grid>
            </Grid>
            <TextField fullWidth margin="normal" id="name" label="Section Name" defaultValue={section.name} />
            <TextField fullWidth margin="normal" id="description" label="Section Description" defaultValue={section.description} />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>Fields</Typography>
          <Divider style={{marginBottom: "2em"}}/>
          {section.fields.map(field => (
            <div key={field.id}>
              <FieldEditor {...field} />
              <Divider />
            </div>
          ))}
          <Box mt={3}>
            <Button variant="contained" color="primary">＋ Add Field</Button>
          </Box>
        </div>
      )}
    </Box>
  )
}
  
const FieldEditor = props => {
  const fields = [
    { id: 'name', name: 'Name', type: 'text', required: true, value: props.name },
    { id: 'type', name: 'Type', type: 'text', required: true, value: props.type },
    { id: 'description', name: 'Description', type: 'text', value: props.description },
    { id: 'conversion_ley', name: 'Conversion Key', type: 'text', value: props.conversion_key },
    { id: 'is_required', name: 'Required', type: 'boolean', value: props.is_required },
  ]

  const initialValues =
      fields.reduce((acc, f) => { acc[f.id] = f.value; return acc }, {})

  const validate = () => {
    return {}
  }

  const onSubmit = () => {
    
  }

  return (
    <Box my={3} flexGrow={1}>
      <Grid container justify="space-between" my={2}>
        <Grid item>
          <Typography component="h1" variant="h6" gutterBottom>Field #{props.index+1}</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" size="small">Delete Field</Button>
        </Grid>
      </Grid>
      <UpdateForm 
        fields={fields} 
        initialValues={initialValues} 
        onSubmit={(values, { setSubmitting }) => {
          console.log('Submit:', values)
          // submitFormMutation(values)
          // setSubmitting(false)
        }}
      />
    </Box>
  )
}

export async function getServerSideProps({ req, query }) {
  const form = await req.api.form(query.id)
  return { props: { form } }
}

export default FormEditor