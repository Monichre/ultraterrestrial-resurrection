import React from 'react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Image } from '@tiptap/extension-image'
import { Typography } from '@tiptap/extension-typography'
import { Selection } from '@tiptap/extensions'

/**
 * Wraps children in a Tiptap EditorContext with a real editor instance.
 * Use this for stories of tiptap-ui button components that call useTiptapEditor().
 *
 * Usage:
 *   <TiptapStoryEditor>{<BlockquoteButton />}</TiptapStoryEditor>
 */
export function TiptapStoryEditor({
  children,
  content = '<p>Storybook editor content — select text to activate toolbar buttons.</p>',
  showEditor = true,
}: {
  children: React.ReactNode
  content?: string
  showEditor?: boolean
}) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ] as any,
    content,
    editorProps: {
      attributes: {
        'aria-label': 'Storybook editor',
        class: 'simple-editor',
      },
    },
  })

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="simple-editor-wrapper" style={{ maxWidth: 720, width: '100%' }}>
        {children}
        {showEditor && (
          <EditorContent editor={editor} className="simple-editor-content" />
        )}
      </div>
    </EditorContext.Provider>
  )
}
