'use client';

import { useState } from 'react';
import { DocumentLibrary } from '@/components/document-library/document-library';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, FileText, Save, Download } from 'lucide-react';

interface Document {
  id: string;
  data: string;
  metadata: {
    title: string;
    source: string;
    doc_type: string;
    created_at: string;
    updated_at: string;
    tags: string[];
  };
}

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
    ],
    content: '',
    editable: isEditing,
  });

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditing(false);
    
    // Load document content into TipTap
    if (editor) {
      editor.commands.setContent(doc.data);
      editor.setEditable(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    editor?.setEditable(true);
  };

  const handleSave = async () => {
    if (!editor || !selectedDocument) return;

    const content = editor.getHTML();
    
    // Here you would save the edited content
    // For now, just log it
    console.log('Saving document:', {
      id: selectedDocument.id,
      content,
    });

    setIsEditing(false);
    editor.setEditable(false);
  };

  const handleExport = () => {
    if (!editor || !selectedDocument) return;

    const content = editor.getText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocument.metadata.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Library</h1>
        <p className="text-gray-600">
          Browse and view UFO/UAP research documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Library */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Browse Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentLibrary onDocumentSelect={handleDocumentSelect} />
            </CardContent>
          </Card>
        </div>

        {/* Document Viewer/Editor */}
        <div className="lg:col-span-2">
          {selectedDocument ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle>{selectedDocument.metadata.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button size="sm" onClick={handleEdit}>
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            editor?.setEditable(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedDocument(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Source: {selectedDocument.metadata.source}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <EditorContent editor={editor} className="min-h-[500px]" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Select a document to view</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}