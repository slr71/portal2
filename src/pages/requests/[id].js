import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Paper, List, ListItem, Typography } from '@material-ui/core'
import { Layout, FormStepper, FormField, FormControls } from '../../components'
import api from '../../api'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Request = props => {
  const form = props.form
  const classes = useStyles()

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleChange = () => {}

  return (
    <Layout {...props}>
      <Container maxWidth='md'>
        <Paper elevation={3} className={classes.paper}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>{form.name}</Typography>
            <Typography color="textSecondary" gutterBottom>{form.description}</Typography>
            {form.explanation !== form.description ? (
              <Typography color="textSecondary">
                <Markdown>
                  {form.explanation}
                </Markdown>
              </Typography>
            ) : (
              <></>
            )}
          </Box>
          {form.sections.length > 1 ? <FormStepper activeStep={activeStep} steps={form.sections}/> : <></>}
          <List>
            {form.sections[activeStep].fields.map(field => (
              <ListItem>
                <FormField {...field} changeHandler={handleChange}/>
              </ListItem>
            ))}
          </List>
          <Box display="flex" justifyContent="flex-end">
            <FormControls 
              activeStep={activeStep} 
              numSteps={form.sections.length} 
              nextHandler={handleNext}
              backHandler={handleBack}
            />
          </Box>
        </Paper>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query

  //FIXME move user request into Express middleware
  const user = await api.user()
  const form = await api.form(id)

  return { props: { user, form } }
}

export default Request