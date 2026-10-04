// Removed Spinner import for Storybook compatibility
import { useDropZone, useFileUpload, useUploader } from './hooks'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils'
import { ChangeEvent, useCallback } from 'react'

export const ImageUploader = ( {
  onUpload,
}: {
  onUpload: ( url: string ) => void
} ) => {
  const { loading, uploadFile } = useUploader( { onUpload } )
  const { handleUploadClick, ref } = useFileUpload()
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone( {
    uploader: uploadFile,
  } )

  const onFileChange = useCallback(
    ( e: ChangeEvent<HTMLInputElement> ) =>
      e.target.files ? uploadFile( e.target.files[0] ) : null,
    [uploadFile]
  )

  if ( loading ) {
    return (
      <div className='flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80'>
        <svg className='animate-spin text-neutral-500' width='24' height='24' viewBox='0 0 24 24' role='status' aria-label='loading'>
          <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' opacity='0.25' />
          <path d='M22 12a10 10 0 0 1-10 10' stroke='currentColor' strokeWidth='4' fill='none'>
            <animateTransform attributeName='transform' type='rotate' from='0 12 12' to='360 12 12' dur='1s' repeatCount='indefinite' />
          </path>
        </svg>
      </div>
    )
  }

  const wrapperClass = cn(
    'flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80',
    draggedInside && 'bg-neutral-100'
  )

  return (
    <div
      className={wrapperClass}
      onDrop={onDrop}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
    >
      <Icon
        name='Image'
        className='w-12 h-12 mb-4 text-black dark:text-white opacity-20'
      />
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='text-sm font-medium text-center text-neutral-400 dark:text-neutral-500'>
          {draggedInside ? 'Drop image here' : 'Drag and drop or'}
        </div>
        <div>
          <Button
            disabled={draggedInside}
            onClick={handleUploadClick}
            variant='primary'
            buttonSize='small'
          >
            <Icon name='Upload' />
            Upload an image
          </Button>
        </div>
      </div>
      <input
        className='w-0 h-0 overflow-hidden opacity-0'
        ref={ref}
        type='file'
        accept='.jpg,.jpeg,.png,.webp,.gif'
        onChange={onFileChange}
      />
    </div>
  )
}

export default ImageUploader
