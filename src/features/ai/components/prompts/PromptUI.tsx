'use client'

import Image from 'next/image'
import * as React from 'react'

import { Answer } from '@/features/ai/components/prompts/Answer'
import SimilarTopics from '@/features/ai/components/prompts/SimilarTopics'
import { Sources } from '@/features/ai/components/prompts/Sources'

import { PromptInput } from '@/features/ai/components/prompts/PromptInput'
import { usePromptState } from '@/features/ai/components/prompts/PromptState'

interface PromptUIProps { }

export const PromptUI: React.FC<PromptUIProps> = () => {
  const {
    showResult,
    promptValue,
    setPromptValue,
    question,
    handleDisplayResult,
    sources,
    isLoadingSources,
    answer,
    similarQuestions,
    chatContainerRef,
    reset,
  } = usePromptState()
  return (
    <div>
      {showResult && (
        <div className='flex h-full min-h-[68vh] w-full grow flex-col justify-between'>
          <div className='container w-full space-y-2'>
            <div className='container space-y-2'>
              <div className='container flex w-full items-start gap-3 px-5 pt-2 lg:px-10'>
                <div className='flex w-fit items-center gap-4'>
                  <Image
                    unoptimized
                    src={'/img/message-question-circle.svg'}
                    alt='message'
                    width={30}
                    height={30}
                    className='size-[24px]'
                  />
                  <p className='pr-5 font-bold uppercase leading-[152%] text-black'>
                    Question:
                  </p>
                </div>
                <div className='grow'>&quot;{question}&quot;</div>
              </div>
              <>
                <Sources sources={sources} isLoading={isLoadingSources} />
                <Answer answer={answer} />
                <SimilarTopics
                  similarQuestions={similarQuestions}
                  handleDisplayResult={handleDisplayResult}
                  reset={reset}
                />
              </>
            </div>

            <div className='pt-1 sm:pt-2' ref={chatContainerRef}></div>
          </div>
          <div className='container px-4 lg:px-0'>
            <PromptInput
              promptValue={promptValue}
              setPromptValue={setPromptValue}
              handleDisplayResult={handleDisplayResult}
              reset={reset}
            />
          </div>
        </div>
      )}
    </div>
  )
}
