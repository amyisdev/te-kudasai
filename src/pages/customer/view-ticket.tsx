import { useParams } from 'react-router'

export default function ViewTicket() {
  const { id } = useParams()

  return (
    <div>
      <h1>View Ticket {id}</h1>
    </div>
  )
}
