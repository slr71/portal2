import fetch from 'isomorphic-unfetch'
import Markdown from 'markdown-to-jsx'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Box, Divider, Paper, List, ListItem, Typography } from '@material-ui/core'
import { Layout, FormStepper, FormField, FormControls } from '../../components'
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
    <Layout {...props}>
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
                <FormField {...field} changeHandler={handleChange}/>
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

Request.getInitialProps = async function(context) {
  const { id } = context.query

  let res = await fetch(apiBaseUrl + `/users/mine`)
  const user = await res.json()

  res = await fetch(apiBaseUrl + `/requests/${id}`)
  const request = await res.json()

  return { user, request }
}

export default Request