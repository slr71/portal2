const DateRange = (props) => {
  return (
    <>
      <DateSpan date={props.date1} /> - <DateSpan date={props.date2} />
    </>
  )
}

const DateSpan = (props) => {
  const d = new Date(props.date)
  const month = d.toLocaleString('default', { month: 'short' })
  const day = d.getDate()
  const year = d.getFullYear()

  return <>{month} {day}, {year}</>
}

export { DateSpan, DateRange }