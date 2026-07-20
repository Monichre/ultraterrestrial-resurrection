import type {ReactNode} from 'react'
import type {HudPositionLogRow} from './types'

const DEFAULT_ROWS: ReadonlyArray<HudPositionLogRow> = [
  {time: '2025-06-24 10:00:00', x: '12,543.23', y: '12,543.23', z: '12,543.23'},
  {time: '2025-06-24 10:15:00', x: '12,543.23', y: '12,543.23', z: '12,543.23'},
  ...Array.from({length: 8}, () => ({
    time: '2025-06-24 10:00:00',
    x: '12,543.23',
    y: '12,543.23',
    z: '12,543.23',
  })),
]

type PositionLogTableProps = {
  rows?: ReadonlyArray<HudPositionLogRow>
}

export const PositionLogTable = ({rows = DEFAULT_ROWS}: PositionLogTableProps) => (
  <table className='w-full border-separate' style={{borderSpacing: 0}}>
    <caption className='sr-only'>Rocket position log</caption>
    <thead>
      <tr>
        <Th>LOG TIME</Th>
        <Th align='right'>X</Th>
        <Th align='right'>Y</Th>
        <Th align='right'>Z</Th>
      </tr>
    </thead>
    <tbody>
      {rows.slice(0, 10).map((r, i) => (
        <tr key={`${r.time}-${i}`}>
          <Td>{r.time}</Td>
          <Td align='right'>{r.x}</Td>
          <Td align='right'>{r.y}</Td>
          <Td align='right'>{r.z}</Td>
        </tr>
      ))}
    </tbody>
  </table>
)

const Th = ({children, align = 'left'}: {children: ReactNode; align?: 'left' | 'right'}) => (
  <th
    className='pb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-hud-text-secondary'
    style={{textAlign: align}}>
    {children}
  </th>
)

const Td = ({children, align = 'left'}: {children: ReactNode; align?: 'left' | 'right'}) => (
  <td
    className='py-1 text-[11px] text-hud-text-primary'
    style={{textAlign: align, height: 22, lineHeight: '22px'}}>
    {children}
  </td>
)
