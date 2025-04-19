'use server'

import { getXataClient } from '@/db/xata'
const xata = getXataClient()
export async function getEvents() {
  const events = await xata.db.events
    .sort( 'date', 'desc' )
    .select( [
      'name',
      'description',
      'location',
      'latitude',
      'photos',
      'photos.signedUrl',
      'photos.enablePublicUrl',
      'longitude',
      'date',
    ] )
    .getAll()
    .then( ( res ) => res.toSerializable() )
  return events
}

export async function getKeyFigures() {
  const personnel = await xata.db.personnel
    .select( [
      'name',
      'bio',
      'role',
      'photo',
      'photo.signedUrl',
      'photo.enablePublicUrl',
      'rank',
      'credibility',
      'popularity',
    ] )
    .getAll()
    .then( ( res ) => res.toSerializable() )
  return personnel
}

export async function getTestimonies() {
  const testimonies = await xata.db.testimonies
    .select( [
      '*',
      'witness.id',
      'witness.name',
      'witness.role',
      'witness.photo',
      'witness.photo.signedUrl',
      'event.id',
      'event.name',
      'event.date',
    ] )
    .getAll()
    .then( ( res ) => res.toSerializable() )
  return testimonies
}

export async function getOrganizations() {
  const organizations = await xata.db.organizations
    .getAll()
    .then( ( res ) => res.toSerializable() )
  return organizations
}

export async function getTopics() {
  const topics = await xata.db.topics
    .getAll()
    .then( ( res ) => res.toSerializable() )

  return topics
}
