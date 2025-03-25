import { getXataClient } from '@/db/xata'
// import { clerkClient } from '@clerk/nextjs/server'
const xata = getXataClient()

export const getUserByAuthId = async ( user ) => {
  const id = user?.id || null
  if ( !id ) return null
  const { records } = await xata.db.users.search( id, {
    target: [{ column: 'external_id' }],
    fuzziness: 0,
    prefix: 'phrase',
  } )
  console.log( 'records: ', records )

  // await clerkClient.users.updateUserMetadata(userId, {
  //   publicMetadata: {
  //     role
  //   }
  // })

  return records[0]
}
