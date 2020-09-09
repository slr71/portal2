import { useMutation } from 'react-query'
import { Container, Box, Paper, Divider, Typography, Button, IconButton, Tab, Tabs, TextField, Checkbox, Grid, makeStyles } from '@material-ui/core'
import { Layout, UpdateForm } from '../../../components'
import { useAPI } from '../../../contexts/api'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    paddingTop: '2em'
  },
  paper: {
    padding: '3em'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  title: {
    fontSize: 27,
    color: 'black'
  },
}))

const FormEditor = (props) => {
  const classes = useStyles()
  const api = useAPI()

  const [tab, setTab] = React.useState(0)
  const [form, setForm] = React.useState(props.form)

  const height = Math.max(
    form.sections.length * 1,
    form.sections[tab] && form.sections[tab].fields ? form.sections[tab].fields.length * 32 : 0
  ) + 150

  const handleTabChange = (event, newTab) => setTab(newTab)

  const [updateFormMutation] = useMutation(
    (fields) => api.updateForm(form.id, fields),
    {
      onSuccess: (resp) => {
        console.log('updateForm SUCCESS', resp)
      },
      onError: (error) => {
        console.log('updateForm ERROR', error)
      }
    }
  )

  const [addSectionMutation] = useMutation(
    () =>
      api.createFormSection({ 
        form_id: form.id, 
        name: 'New section', 
        description: '',
        index: form.sections.reduce((acc, s) => Math.max(acc, s.index + 1), 0)
      })
      .then( () => api.form(form.id) ),
    {
      onSuccess: (resp) => {
        console.log('createFormSection SUCCESS', resp)
        setForm(resp)
        setTab(resp.sections[-1].index)
      },
      onError: (error) => {
        console.log('createFormSection ERROR', error)
      }
    }
  )

  const [deleteSectionMutation] = useMutation(
    (id) => api.deleteFormSection(id).then( () => api.form(form.id) ),
    {
      onSuccess: (resp) => {
        console.log('deleteFormSection SUCCESS', resp)
        const index = form.sections.findIndex(s => s.id == resp)
        setTab(index-1)
        setForm(resp)
      },
      onError: (error) => {
        console.log('deleteFormSection ERROR', error)
      }
    }
  )

  const [updateSectionMutation] = useMutation(
    (fields) => api.updateFormSection(form.sections[tab].id, fields),
    {
      onSuccess: (resp) => {
        console.log('updateFormSection SUCCESS', resp)
      },
      onError: (error) => {
        console.log('updateFormSection ERROR', error)
      }
    }
  )

  const [addFieldMutation] = useMutation(
    () =>
      api.createFormField({ 
        form_section_id: form.sections[tab].id, 
        name: 'New field', 
        type: 'text', 
        is_required: true,
        index: form.sections[tab].fields ? form.sections[tab].fields.reduce((acc, f) => Math.max(acc, f.index + 1), 0) : 0,
      })
      .then( () => api.form(form.id) ),
    {
      onSuccess: (resp) => {
        console.log('createFormField SUCCESS', resp)
        setForm(resp)
      },
      onError: (error) => {
        console.log('createFormField ERROR', error)
      }
    }
  )

  const [deleteFieldMutation] = useMutation(
    (id) => api.deleteFormField(id).then( () => api.form(form.id) ),
    {
      onSuccess: (resp) => {
        console.log('deleteFormField SUCCESS', resp)
        setForm(resp)
      },
      onError: (error, { onError }) => {
        console.log('deleteFormSection ERROR', error)
      }
    }
  )

  const [updateFieldMutation] = useMutation(
    ({ id, values }) => api.updateFormField(id, values).then( () => api.form(form.id) ),
    {
      onSuccess: (resp) => {
        console.log('updateFormField SUCCESS', resp)
      },
      onError: (error) => {
        console.log('updateFormField ERROR', error)
      }
    }
  )

  return (
    <Layout>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={classes.paper} style={{height: height + "em"}}>
          <Box m={3}>
            <Grid container justify="space-between">
              <Grid item>
                <TextField 
                  margin="none" 
                  style={{width: "50vw"}}
                  id="name" 
                  label="Name"
                  InputProps={{
                    classes: {
                      input: classes.title,
                    }
                  }} 
                  defaultValue={form.name} 
                  onChange={(e) => updateFormMutation({ name: e.target.value })}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="error">Delete Form</Button>
              </Grid>
            </Grid>
            <TextField 
              margin="normal" 
              style={{width: "50vw"}}
              multiline
              rows={2}
              id="description" 
              label="Description"
              defaultValue={form.description} 
              onChange={(e) => updateFormMutation({ description: e.target.value })}
            />
          </Box>
          <div className={classes.root}>
            <Tabs 
              orientation="vertical"
              variant="scrollable"
              value={tab}
              onChange={handleTabChange}
              className={classes.tabs}
            >
              {form.sections.map((section, index) => (
                <Tab key={index} label={section.name} />
              ))}
              <Button color="primary" onClick={addSectionMutation}>+ Add Section</Button>
            </Tabs>
            {form.sections.map((section, index) => (
              <SectionTabPanel 
                key={index} 
                value={tab} 
                index={index} 
                section={section} 
                onUpdate={updateSectionMutation}
                onDelete={deleteSectionMutation} 
                onAddField={addFieldMutation} 
                onDeleteField={deleteFieldMutation}
                onUpdateField={updateFieldMutation}
              />
            ))}
          </div>
        </Paper>
      </Container>
    </Layout>
  )
}

const SectionTabPanel = ({ section, value, index, onUpdate, onDelete, onAddField, onDeleteField, onUpdateField }) => {
  return (
    <Box
      p={3}
      flexGrow={1}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <div>
          <Box mb={5}>
            <Grid container justify="space-between" my={2}>
              <Grid item>
                <Typography component="h1" variant="h5" gutterBottom>Section</Typography>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small" 
                  onClick={() => onDelete(section.id)}
                >
                  Delete Section
                </Button>
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              margin="normal" 
              id="name" 
              label="Section Name" 
              required
              defaultValue={section.name} 
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
            <TextField 
              fullWidth 
              margin="normal" 
              id="description" 
              label="Section Description" 
              required
              defaultValue={section.description} 
              onChange={(e) => onUpdate({ description: e.target.value })}
            />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>Fields</Typography>
          <Divider style={{marginBottom: "2em"}}/>
          {section.fields && section.fields.map(field => (
            <div key={field.id}>
              <FieldEditor {...field} onDelete={() => onDeleteField(field.id)} onSubmit={onUpdateField} />
              <Divider />
            </div>
          ))}
          <Box mt={3}>
            <Button variant="contained" color="primary" onClick={onAddField}>＋ Add Field</Button>
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

  return (
    <Box my={3} flexGrow={1}>
      <Grid container justify="space-between" my={2}>
        <Grid item>
          <Typography component="h1" variant="h6" gutterBottom>Field #{props.index+1}</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" size="small" onClick={props.onDelete}>Delete Field</Button>
        </Grid>
      </Grid>
      <UpdateForm 
        fields={fields} 
        autosave
        onSubmit={(values, { setSubmitting }) => {
          console.log('Submit:', values)
          props.onSubmit({ id: props.id, values })
          setSubmitting(false)
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