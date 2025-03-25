// import { getUserByAuthId } from '@/features/user/get-user-by-auth-id'
import * as React from 'react'

import { AdminDashboard } from '@/features/admin/AdminDashboard'

export default async function Index() {
  // Server Action

  return (
    <div className='h-[100vh] overflow-hidden admin bg-black relative'>
      <div className='overflow-visible absolute inset-0 z-0 top-0 left-0 h-full w-full'>
        <div
          className='bg-purple-800 blur-[250px] left-[calc(70%_-_271px)] opacity-60 absolute top-[370.00rem] w-[33.88rem] h-[33.88rem] rounded-full'
          id='div-1'
        />
        <div
          className='bg-blue-500 blur-[250px] left-[calc(30%_-_271px)] opacity-60 absolute top-[370.00rem] w-[33.88rem] h-[33.88rem] rounded-full'
          id='div-2'
        />
        <div
          className='bg-purple-800 blur-[250px] opacity-60 absolute right-[-49.94rem] top-[121.31rem] w-[63.25rem] h-[63.25rem] rounded-full min-[810px]:top-[143.75rem]'
          id='div-3'
        />
        <div
          className='bg-blue-500 blur-[250px] left-[-47.13rem] opacity-60 absolute top-[161.06rem] w-[63.25rem] h-[63.25rem] rounded-full min-[810px]:top-[206.25rem]'
          id='div-4'
        />
      </div>
      <AdminDashboard />
    </div>
  )
}

// Behavior Patterns	Classifying observed behaviors
// Physical Characteristics	Analyzing different physical traits
// Impact + Human Interaction	Examining the effects on humans
// Historical Perspectives	Interactions across historical periods
// Scientific Theories	Exploring various scientific explanations
// Legal + Policy	Laws, regulations, and policies
// Ethical Considerations	Communication and  intervention
// Public Perception	Media, public opinion, and pop culture
// Origins and Intent	Comprehensive view of current theories
