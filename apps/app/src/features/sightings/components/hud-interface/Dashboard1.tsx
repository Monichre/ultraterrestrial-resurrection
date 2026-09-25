import HudDash from './HudDash'

interface Dashboard1Props {
  className?: string
}

const Dashboard1: React.FC<Dashboard1Props> = ({className}) => {
  return <HudDash className={className} />
}

export default Dashboard1
