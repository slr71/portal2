const DateRange = ({ date1, date2 }) => {
  return (
    <>
      <DateSpan date={date1} /> - <DateSpan date={date2} />
    </>
  )
}

const DateSpan = ({ date }) => {
  const d = new Date(date)
  const month = d.toLocaleString('default', { month: 'short' })
  const day = d.getDate()
  const year = d.getFullYear()

  return <>{month} {day}, {year}</>
}

export { DateSpan, DateRange }