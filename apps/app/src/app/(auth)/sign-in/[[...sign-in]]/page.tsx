import { SignIn } from '@clerk/nextjs'

import React from 'react'
import { getUserByAuthId } from '@/features/user/get-user-by-auth-id'
import { currentUser, clerkClient } from '@clerk/nextjs/server'

export default async function Page() {
  const user: any = await currentUser()
  if ( !user?.publicMetadata?.databaseId ) {
    const dbUser = await getUserByAuthId( user )
    console.log( 'dbUser: ', dbUser )
    if ( dbUser ) {
      const response = await clerkClient.users.updateUserMetadata( user.id, {
        publicMetadata: {
          databaseId: dbUser.id,
        },
      } )
      console.log( 'response: ', response )
    }
  }

  return <SignIn />
}
