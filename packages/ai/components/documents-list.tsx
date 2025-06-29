import {ScrollArea} from '@/components/ui/scroll-area'

import {DocumentCard} from './document-card'
import {supabaseAdminClient} from '../lib/db/client'

export async function DocumentsList() {
  // Fetch initial documents
  const {data: documents} = await supabaseAdminClient
    .from('doc_processor_documents')
    .select('*')
    .order('created_at', {ascending: false})

  // Fetch all tasks
  const {data: tasks} = await supabaseAdminClient
    .from('doc_processor_processing_tasks')
    .select('*')
    .order('created_at', {ascending: true})

  const {data: chunks} = await supabaseAdminClient
    .from('doc_processor_document_chunks')
    .select('*')
    .order('created_at', {ascending: true})

  const {data: entities} = await supabaseAdminClient
    .from('doc_processor_document_entities')
    .select('*')
    .order('created_at', {ascending: true})

  if (!documents) {
    return <div>No documents found</div>
  }

  return (
    // <ScrollArea className="h-[600px]">
    <div className='space-y-4 pr-4'>
      <h2 className='pl-1 text-xs font-semibold text-muted-foreground'>
        Recent Documents
      </h2>
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          tasks={
            tasks?.filter((task) => task.document_id === document.id) ?? []
          }
          chunks={
            chunks?.filter((chunk) => chunk.document_id === document.id) ?? []
          }
          entities={
            entities?.filter((entity) => entity.document_id === document.id) ??
            []
          }
        />
      ))}
    </div>
    // </ScrollArea>
  )
}
