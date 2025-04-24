'use server'

import { revalidatePath } from 'next/cache'
import { 
  createUserNote, 
  getUserNoteById, 
  getUserNotesByUserId, 
  updateUserNote, 
  deleteUserNote, 
  searchUserNotesByUserId, 
  getRecentUserNotes 
} from '@/db/xata/functions/user-notes'
import type { UserNotes, UserNotesRecord } from '@/db/xata/xata'

/**
 * Create a new user note
 * @param userId The ID of the user creating the note
 * @param name The name/title of the note
 * @param content The content of the note
 * @param synopsis Optional synopsis of the note
 * @returns The created note or error
 */
export async function createNote(
  userId: string,
  name: string,
  content: string,
  synopsis?: string
): Promise<{ success: boolean; note?: UserNotesRecord; error?: string }> {
  try {
    if (!userId || !name || !content) {
      return {
        success: false,
        error: 'User ID, name, and content are required'
      }
    }

    const note = await createUserNote({
      user: { id: userId },
      name,
      content,
      synopsis: synopsis || null
    })

    revalidatePath('/notes')
    
    return {
      success: true,
      note
    }
  } catch (error) {
    console.error('Error creating note:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create note'
    }
  }
}

/**
 * Get a note by ID
 * @param noteId The ID of the note to retrieve
 * @returns The note or error
 */
export async function getNoteById(
  noteId: string
): Promise<{ success: boolean; note?: UserNotesRecord; error?: string }> {
  try {
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required'
      }
    }

    const note = await getUserNoteById(noteId)
    
    if (!note) {
      return {
        success: false,
        error: 'Note not found'
      }
    }

    return {
      success: true,
      note
    }
  } catch (error) {
    console.error(`Error getting note ${noteId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get note'
    }
  }
}

/**
 * Get all notes for a user
 * @param userId The ID of the user
 * @returns The user's notes or error
 */
export async function getNotesByUserId(
  userId: string
): Promise<{ success: boolean; notes?: UserNotesRecord[]; error?: string }> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    const notes = await getUserNotesByUserId(userId)

    return {
      success: true,
      notes
    }
  } catch (error) {
    console.error(`Error getting notes for user ${userId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get notes'
    }
  }
}

/**
 * Update a note
 * @param noteId The ID of the note to update
 * @param data The data to update (name, content, synopsis)
 * @returns The updated note or error
 */
export async function updateNote(
  noteId: string,
  data: Partial<Pick<UserNotes, 'name' | 'content' | 'synopsis'>>
): Promise<{ success: boolean; note?: UserNotesRecord; error?: string }> {
  try {
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required'
      }
    }

    if (Object.keys(data).length === 0) {
      return {
        success: false,
        error: 'No data provided for update'
      }
    }

    const note = await updateUserNote(noteId, data)
    
    if (!note) {
      return {
        success: false,
        error: 'Note not found'
      }
    }

    revalidatePath('/notes')

    return {
      success: true,
      note
    }
  } catch (error) {
    console.error(`Error updating note ${noteId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update note'
    }
  }
}

/**
 * Delete a note
 * @param noteId The ID of the note to delete
 * @returns Success or error status
 */
export async function deleteNote(
  noteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required'
      }
    }

    const result = await deleteUserNote(noteId)
    
    if (!result) {
      return {
        success: false,
        error: 'Note not found or already deleted'
      }
    }

    revalidatePath('/notes')

    return { success: true }
  } catch (error) {
    console.error(`Error deleting note ${noteId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete note'
    }
  }
}

/**
 * Search user's notes
 * @param userId The ID of the user
 * @param searchTerm The term to search for
 * @returns Matching notes or error
 */
export async function searchNotes(
  userId: string,
  searchTerm: string
): Promise<{ success: boolean; notes?: UserNotesRecord[]; error?: string }> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    if (!searchTerm || searchTerm.trim() === '') {
      return {
        success: false,
        error: 'Search term is required'
      }
    }

    const notes = await searchUserNotesByUserId(userId, searchTerm)

    return {
      success: true,
      notes
    }
  } catch (error) {
    console.error(`Error searching notes for user ${userId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search notes'
    }
  }
}

/**
 * Get recent notes for a user
 * @param userId The ID of the user
 * @param limit Number of recent notes to return (default: 5)
 * @returns Recent notes or error
 */
export async function getRecentNotes(
  userId: string,
  limit = 5
): Promise<{ success: boolean; notes?: UserNotesRecord[]; error?: string }> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      }
    }

    const notes = await getRecentUserNotes(userId, limit)

    return {
      success: true,
      notes
    }
  } catch (error) {
    console.error(`Error getting recent notes for user ${userId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get recent notes'
    }
  }
}