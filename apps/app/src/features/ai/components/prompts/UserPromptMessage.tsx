import React from 'react'

type UserPromptMessageProps = {
  message: string
  chatId?: string
  showShare?: boolean
}

export const UserPromptMessage: React.FC<UserPromptessageProps> = ({
  message,
  chatId,
  showShare = false,
}) => {
  const enableShare = process.env.ENABLE_SHARE === 'true'
  return (
    <div className='flex items-center w-full space-x-1 mt-2 min-h-10'>
      <div className='text-xl flex-1 break-words w-full'>{message}</div>
    </div>
  )
}
