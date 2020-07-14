import fetch from 'isomorphic-unfetch'
import PropTypes from 'prop-types';
import { Container, Box, Paper, Divider, Typography, Button, Tab, Tabs, TextField, FormControlLabel, Checkbox, makeStyles } from '@material-ui/core'
import { Layout } from '../../../components'
import { apiBaseUrl } from '../../../config.json'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    height: 224
  },
  paper: {
    padding: '4em'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const Form = props => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const height = props.form.sections[value].fields.length * 32 + 37

  return (
    <Layout {...props}>
      <Container maxWidth='lg'>
        <Paper elevation={3} className={useStyles().paper} style={{height: height + "em"}}>
          <Box display='flex' ml={4} mb={2}>
            <Typography component="h1" variant="h4" gutterBottom>Form: </Typography>
            <Typography component="h1" variant="h4" color="secondary" gutterBottom>{props.form.name}</Typography>
            <Button variant="contained" color="primary">Edit Name</Button>
            <Button variant="contained" color="secondary">Delete Form</Button>
          </Box>
          <div className={useStyles().root}>
            <Tabs 
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              className={useStyles().tabs}
            >
              {props.form.sections.map((section, index) => (
                <Tab key={section.id} label={section.name} />
              ))}
              <Tab label="＋ Add Section"></Tab>
            </Tabs>
            {props.form.sections.map((section, index) => (
              <TabPanel key={section.id} value={value} index={index} section={section} />
            ))}
          </div>
        </Paper>
      </Container>
    </Layout>
  )
}

function TabPanel(props) {
  const { section, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Box mb={5}>
            <Box display="flex">
              <Typography component="h1" variant="h5" gutterBottom>Section:</Typography>
              <Typography component="h1" variant="h5" color="secondary" gutterBottom>{section.name}</Typography>
              <Button variant="contained" color="secondary">Delete Section</Button>
            </Box>
            <TextField fullWidth margin="normal" id="name" label="Section Name" defaultValue={section.name} />
            <TextField fullWidth margin="normal" id="description" label="Section Description" defaultValue={section.description} />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>Fields</Typography>
          <Divider style={{marginBottom: "2em"}}/>
          {section.fields.map(field => (
            <div key={field.id}>
              <FormField {...field}></FormField>
              <Divider />
            </div>
          ))}
          <Box mt={3}>
            <Button variant="contained" color="primary">＋ Add Field</Button>
          </Box>
        </Box>
      )}
    </div>
  )
}
  
TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const FormField = props => (
  <Box my={3}>
    <Box display="flex">
      <Typography component="h1" variant="h6" gutterBottom>Field:</Typography>
      <Typography component="h1" variant="h6" color="secondary" gutterBottom>{props.name}</Typography>
      <Button variant="contained" color="secondary">Delete Field</Button>
    </Box>
    <TextField fullWidth margin="normal" label="Name" defaultValue={props.name} />
    <TextField fullWidth margin="normal" label="Type" defaultValue={props.type} />
    <TextField fullWidth margin="normal" label="Description" defaultValue={props.description} />
    <FormControlLabel
      control={
        <Checkbox checked={props.is_required} name={props.id} color="primary" />
      }
      label="Required"
      style={{marginTop: "1.5em"}}
    />
    <TextField fullWidth margin="normal" label="Conversion Key" defaultValue={props.conversion_key} />
  </Box>
)

export async function getServerSideProps(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/requests/${id}`)
  const form = await res.json()

  return { props: { user, form } }
}

export default Form