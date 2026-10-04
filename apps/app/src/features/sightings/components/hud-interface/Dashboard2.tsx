import HudDash from './HudDash'

interface Dashboard2Props {
  className?: string
}

const Dashboard2: React.FC<Dashboard2Props> = ({className}) => {
  return <HudDash className={className} />
}

export default Dashboard2
