import { RAGSettingsPanel } from '@/components/admin/rag-settings'

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
      
      <div className="space-y-8">
        <RAGSettingsPanel />
        
        {/* Add other admin panels here in the future */}
      </div>
    </div>
  )
}