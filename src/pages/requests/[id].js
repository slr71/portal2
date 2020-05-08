import fetch from 'isomorphic-unfetch'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Divider, Button, Paper, List, ListItem, FormControlLabel, TextField, MenuItem, Checkbox, Typography } from '@material-ui/core'
import { Stepper, Step, StepLabel } from '@material-ui/core'
import { Layout } from '../../components'
import { apiBaseUrl } from '../../config.json'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '4em'
  }
}))

const Request = props => {
  const request = props.request
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
    <Layout>
      <Container maxWidth='md'>
        <Paper elevation={3} className={classes.paper}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>{request.name}</Typography>
            <Typography color="textSecondary" gutterBottom>{request.description}</Typography>
            <Divider />
            {request.explanation !== request.description ? (
              <Typography color="textSecondary">
                <Markdown>
                  {request.explanation}
                </Markdown>
              </Typography>
            ) : (
              <></>
            )}
          </Box>
          {request.sections.length > 1 ? <FormStepper activeStep={activeStep} steps={request.sections}/> : <></>}
          <List>
            {request.sections[activeStep].fields.map(field => (
              <ListItem>
                <FormField field={field} changeHandler={handleChange}/>
              </ListItem>
            ))}
          </List>
          <Box display="flex" justifyContent="flex-end">
            <FormControls 
              activeStep={activeStep} 
              numSteps={request.sections.length} 
              nextHandler={handleNext}
              backHandler={handleBack}
            />
          </Box>
        </Paper>
      </Container>
    </Layout>
  )
}

const FormStepper = props => {
  const activeStep = props.activeStep
  const steps = props.steps
  console.log(activeStep)

  return (
    <Stepper>
      {steps.map(step => (
        <Step key={step.id} completed={activeStep > step.index} active={activeStep == step.index}>
          <StepLabel>{step.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

const FormField = props => {
  const field = props.field
  const changeHandler = props.changeHandler

  if (field.type === 'boolean') {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={false}
            name={field.id}
            color="primary"
          />
        }
        label={field.name}
      />
    )
  }

  return ( // type is 'char', 'text', or 'select'
    <TextField 
      required={field.is_required} 
      fullWidth autoFocus={field.index == 0} 
      margin="normal" 
      id={field.id} 
      label={field.name} 
      helperText={field.description}
      select={field.options.length > 0}
      onChange={changeHandler}
    >
      {field.options.map(option => (
        <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
      ))}
    </TextField>
  )
}

const FormControls = props => {
  const activeStep = props.activeStep
  const numSteps = props.numSteps

  return (
    <div>
      {activeStep === props.numSteps ? (
        <div>
          <Typography>
            All steps completed - you&apos;re finished
          </Typography>
        </div>
      ) : (
        <div>
          <div>
            {numSteps > 1 ? (
              <Button disabled={activeStep === 0} onClick={props.backHandler}>
                Back
              </Button> 
            ) : (
              <></>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={props.nextHandler}
            >
              {activeStep === numSteps - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

Request.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(apiBaseUrl + `/requests/${id}`)
  const request = await res.json()

  return { request }
}

export default Request