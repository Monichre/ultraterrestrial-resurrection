import {API_ROWS} from '@/components/document-panel/lib/document-panel-data'

export function ComponentApiTable() {
  return (
    <section className='dp-api' aria-labelledby='spec-api'>
      <h2 id='spec-api' className='dp-api-label'>
        Component API
      </h2>
      <div
        className='dp-api-scroll'
        tabIndex={0}
        role='region'
        aria-label='Component API table, scrollable'
      >
        <table className='dp-api-table'>
          <colgroup>
            <col className='dp-col-prop' />
            <col className='dp-col-type' />
            <col className='dp-col-req' />
            <col className='dp-col-def' />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope='col'>Prop</th>
              <th scope='col'>Type</th>
              <th scope='col'>Required</th>
              <th scope='col'>Default</th>
              <th scope='col'>Description</th>
            </tr>
          </thead>
          <tbody>
            {API_ROWS.map((row) => (
              <tr key={row.prop}>
                <td className='dp-api-prop'>{row.prop}</td>
                <td>{row.type}</td>
                <td className={row.required === 'Yes' ? 'dp-api-req' : undefined}>{row.required}</td>
                <td>{row.defaultValue}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
