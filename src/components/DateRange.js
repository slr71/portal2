import { format } from 'date-fns'

const DateRange = ({ date1, date2, showTime }) => {
  return (
    <>
      <DateSpan date={date1} showTime={showTime} /> to <DateSpan date={date2} showTime={showTime} />
    </>
  )
}

/* 
 * Convert date/time to user's local time.
 *
 * - Postgres stores timestamps in Phoenix time. 
 * - Sequelize automatically converts to UTC
 * - The format() function converts from UTC to user's local time
 */
const DateSpan = ({ date, showTime }) => {
  const d = new Date(date)

  if (showTime)
    return <>{format(d, 'MMM d, yyyy HH:mm a')}</>

  return <>{format(d, 'MMM d, yyyy')}</>
}

export { DateSpan, DateRange }