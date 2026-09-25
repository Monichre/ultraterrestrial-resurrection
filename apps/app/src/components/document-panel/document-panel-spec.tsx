import {SpecificationSidebar} from '@/components/document-panel/specification-sidebar'
import {ComponentApiTable} from '@/components/document-panel/component-api-table'
import {DocumentPanel} from '@/components/document-panel/document-panel'

export function DocumentPanelSpec() {
  return (
    <div className='dp-shellgrid'>
      <div className='dp-top'>
        <SpecificationSidebar />
        <div className='dp-divider' aria-hidden='true' />
        <div className='dp-panel-col'>
          <DocumentPanel />
        </div>
      </div>

      <ComponentApiTable />
    </div>
  )
}
