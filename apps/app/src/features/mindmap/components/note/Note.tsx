'use client'
import { useEditor, EditorContent } from '@tiptap/react'

export interface NoteProps {}

export const Note: React.FC<NoteProps> = (props: NoteProps) => {
  const editor = useEditor()
  return <EditorContent editor={editor} />
}
