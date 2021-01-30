import Markdown from 'markdown-to-jsx'
import { makeStyles, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'
import { DateSpan } from './DateRange'
import { Person as PersonIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  box: {
    marginBottom: '2em'
  },
}))

const Conversations = ({ conversations }) => {
  const classes = useStyles()

  return (
    <div>
      {conversations && conversations.map((conversation, index) => 
        <Conversation key={index} {...conversation} />
      )}
    </div>
  )
}

const Conversation = ({ parts }) => {
  return (
    <List>
      {parts && parts.map((part, index) => (
        <ConversationPart key={index} {...part} />
      ))}
    </List>
  )
}

const ConversationPart = ({ author, part_type, assigned_to, created_at, body }) => {
  let content = []
  if (body) // assume part_type is "note" or "comment"
    content.push(<Markdown>{body}</Markdown>)
  if (part_type && ['assignment', 'default_assignment'].includes(part_type))
    content.push(`Assigned to ${assigned_to.name} (${assigned_to.type})`)

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar>
          <PersonIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={author ? `${author.name} (${author.type})` : ''}
        secondary={(<>
          <DateSpan date={created_at*1000} />
          <br />
          {content.map(c => <>{c}</>)}
        </>)}
      />
    </ListItem>
  )
}

export default Conversations