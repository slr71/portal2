import { makeStyles } from '@material-ui/core/styles'
import Markdown from 'markdown-to-jsx'
import { Container, Grid, Box, Typography, Button, Card, CardHeader, CardContent, CardActions, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import { Person as PersonIcon } from '@material-ui/icons'
import { Layout, User } from '../../../components'
import PortalAPI from '../../../api'

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

const AccessRequest = props => {
  const request = props.request
  const classes = useStyles()

  return (
    <Layout {...props}>
      <Container maxWidth='lg'>
          <h1>Access Request</h1>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <User 
                user={props.request.user}
                institution research
              />
              <Questions questions={request.service.questions} answers={request.answers} />
            </Grid>
            <Grid item xs={6}>
              <Actions {...props} />
              <History {...props} />
              <Conversations {...props} />
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
    <Card className={classes.box}>
      <CardHeader title="Questions" />
      <CardContent>
        <List>
          {questions.map(question => (
            <ListItem>
              <ListItemText
                primary={question.question}
                secondary={question.id in answersByQuestionId ? answersByQuestionId[question.id].value_text : '<No answer>'}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

const Actions = props => {
  const user = props.user
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
    <Card className={classes.box}>
      <CardHeader
        title="Actions"
        // subheader={props.subtitle}
        />
      <CardContent>
        <Typography gutterBottom>
          User has requested access to <b>{props.request.service.name}</b> and the request is currently <b>{props.request.status}</b>.
        </Typography>
        <Typography>
          {text}
        </Typography>
      </CardContent>
      <CardActions>
        {buttons}
      </CardActions>
    </Card>
  )
}

const History = props => {
  const logs = props.request.logs
  const classes = useStyles()

  return (
    <Card className={classes.box}>
      <CardHeader
        title="History"
        // subheader={props.subtitle}
      />
      <CardContent>
        {logs.map((log, i) => (
          <Box key={log.id}>
            <Typography>{log.message}</Typography>
            <Typography variant='subtitle2' color='textSecondary'>{log.created_at}</Typography>
            {i == logs.length - 1 ? <></> : <Divider className={classes.divider} />}
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

const Conversations = props => {
  const conversation = props.request.conversation
  const classes = useStyles()

  return (
    <Card className={classes.box}>
      <CardHeader title="Conversations" />
      <CardContent>
        <Conversation conversation={conversation} />
      </CardContent>
    </Card>
  )
}

const Conversation = props => {
  const conversation = props.conversation

  return (
    <List>
      <ConversationPart part={conversation.source} />
      {conversation.parts.map(part => (<ConversationPart key={part.id} part={part} />))}
    </List>
  )
}

const ConversationPart = props => {
  const part = props.part

  let content
  if (part.part_type && part.part_type == 'assignment')
    content = `Assigned to ${part.assigned_to.id} (${part.assigned_to.type})`
  else // assume part_type is "note" or "comment"
    content = (<Markdown>{part.body}</Markdown>)

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${part.author.name} (${part.author.type})`}
        secondary={content}
      />
    </ListItem>
  )
}

export async function getServerSideProps({ req, query }) {
  const api = new PortalAPI({req})
  const user = await api.user() //FIXME move user request into React context
  const request = await api.serviceRequest(query.id)

  return { props: { user, request } }
}

export default AccessRequest