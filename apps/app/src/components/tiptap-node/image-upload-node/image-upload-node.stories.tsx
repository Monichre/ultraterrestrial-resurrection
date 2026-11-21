import type {Meta, StoryObj} from '@storybook/react'
import React from 'react'
import {EditorContent, EditorContext, useEditor} from '@tiptap/react'
import {StarterKit} from '@tiptap/starter-kit'
import {Image} from '@tiptap/extension-image'
import {ImageUploadNode} from './image-upload-node-extension'

/**
 * Story wrapper that mounts a real Tiptap editor with the ImageUploadNode
 * extension, then inserts an image-upload node so the NodeView renders.
 */
function ImageUploadNodeStory() {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensions: [
      StarterKit.configure({horizontalRule: false}),
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024,
        limit: 3,
        upload: async (_file, _onProgress, _signal) => {
          // no-op upload stub for Storybook
          return 'https://placehold.co/600x400'
        },
        onError: (error) => console.error('Upload failed:', error),
      }),
    ] as any,
    content: '<p>Click below to upload an image.</p>',
    editorProps: {
      attributes: {
        'aria-label': 'Image upload editor',
        class: 'simple-editor',
      },
    },
  })

  React.useEffect(() => {
    if (editor) {
      editor.chain().focus().setImageUploadNode().run()
    }
  }, [editor])

  return (
    <EditorContext.Provider value={{editor}}>
      <div className="simple-editor-wrapper" style={{maxWidth: 720, width: '100%'}}>
        <EditorContent editor={editor} className="simple-editor-content" />
      </div>
    </EditorContext.Provider>
  )
}

const meta = {
  title: 'Components/TiptapNode/ImageUploadNode',
  component: ImageUploadNodeStory,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof ImageUploadNodeStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
