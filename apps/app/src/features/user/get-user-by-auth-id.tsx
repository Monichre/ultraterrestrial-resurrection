import { getUserByExternalId } from '@db/postgres'
// import { clerkClient } from '@clerk/nextjs/server'

export const getUserByAuthId = async ( user ) => {
  const id = user?.id || null
  if ( !id ) return null
  const record = await getUserByExternalId( id )
  console.log( 'record: ', record )

  // await clerkClient.users.updateUserMetadata(userId, {
  //   publicMetadata: {
  //     role
  //   }
  // })

  return record
}
