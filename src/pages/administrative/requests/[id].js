import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Box, Typography, Button, Card, CardHeader, CardContent, CardActions, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import { Layout, Section, User, Conversations } from '../../../components'
import { useUser } from '../../../contexts/user'

//FIXME duplicated elsewhere
const useStyles = makeStyles((theme) => ({
  box: {
    marginBottom: '2em'
  },
  divider: {
    marginTop: '1em',
    marginBottom: '1em'
  }
}))

const AccessRequest = (props) => {
  const request = props.request

  return (
    <Layout title={request.service.name} breadcrumbs>
      <Container maxWidth='lg'>
          <h1>Access Request</h1>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Section title="User">
                <User summaryOnly {...props.request.user} />
              </Section>
              <Questions questions={request.service.questions} answers={request.answers} />
              <History {...props} />
            </Grid>
            <Grid item xs={6}>
              <Actions {...props} />
              <Section title="Conversations">
                <Conversations conversations={request.conversations} />
              </Section>
            </Grid>
          </Grid>
      </Container>
    </Layout>
  )
}

const Questions = ({ questions, answers }) => {
  const classes = useStyles()

  const answersByQuestionId = {}
  answers.forEach(a => answersByQuestionId[a.access_request_question_id] = a)

  return (
    <Section title="Questions">
      {questions && questions.length > 0
        ? questions.map((question, index) => (
            <div key={index}>
              <Typography>{question.question}</Typography>
              <Typography style={{color:"gray"}}>{question.id in answersByQuestionId ? answersByQuestionId[question.id].value_text : '<No answer>'}</Typography>
            </div>
          ))
        : 'None'
      }
    </Section>
  )
}

const Actions = (props) => {
  const [user] = useUser()
  const request = props.request
  const classes = useStyles()

  const handleApprove = async () => {
    const response = await props.api.updateServiceRequest(request.service.id, 'approved', 'Request approved by ' + user.username)
    console.log(response.data)
    props.request = response.data
  }

  const handleDeny = async () => {
    const response = await props.api.updateServiceRequest(request.service.id, 'denied', 'Request denied by ' + user.username)
    console.log(response.data)
  }

  const approveButton = <Button key="approve" color="primary" size="medium" onClick={handleApprove}>APPROVE</Button>
  const denyButton = <Button key="deny" color="secondary" size="medium" onClick={handleDeny}>DENY</Button>

  let buttons, text
  switch (props.request.status) {
    case "pending":
      buttons = [ denyButton, approveButton ]
      break

    case "approved":
      text = 'User has been approved for access, but access has not yet been granted. The request is currently being processed and should change to "granted" shortly.'
      break

    case "granted":
      text = 'No further actions can be performed on requests that have been granted.'
      break

    case "denied":
      buttons = [ approveButton ]
      break
  }

  return (
    <Section title="Actions">
        <Typography gutterBottom>
          User has requested access to <b>{props.request.service.name}</b> and the request is currently <b>{props.request.status}</b>.
        </Typography>
        <Typography>
          {text}
        </Typography>
      <Box display="flex" justifyContent="flex-end">
        {buttons}
      </Box>
    </Section>
  )
}

const History = props => {
  const logs = props.request.logs
  const classes = useStyles()

  return (
    <Section title="History">
      {logs.map((log, i) => (
        <Box key={log.id}>
          <Typography>{log.message}</Typography>
          <Typography variant='subtitle2' color='textSecondary'>{log.created_at}</Typography>
          {i == logs.length - 1 ? <></> : <Divider className={classes.divider} />}
        </Box>
      ))}
    </Section>
  )
}

export async function getServerSideProps({ req, query }) {
  const request = await req.api.serviceRequest(query.id)
  return { props: { request } }
}

export default AccessRequest