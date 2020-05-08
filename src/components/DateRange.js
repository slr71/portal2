const DateRange = (props) => {
  return (
    <div>
      <DateSpan date={props.date1} /> - <DateSpan date={props.date2} />
    </div>
  )
}

const DateSpan = (props) => {
  const d = new Date(props.date)
  const month = d.toLocaleString('default', { month: 'short' })
  const day = d.getDate()
  const year = d.getFullYear()

  return <span>{month} {day}, {year}</span>
}

export default DateRange