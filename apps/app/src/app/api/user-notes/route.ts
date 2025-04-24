import { type NextRequest, NextResponse } from "next/server";
import { 
  createNote, 
  getNoteById, 
  getNotesByUserId, 
  updateNote, 
  deleteNote, 
  searchNotes
} from './actions';

// This file provides a REST API fallback for clients that can't use server actions directly
// Server actions in actions.ts should be the preferred method for internal Next.js usage

/**
 * GET handler: Fetch notes by ID, user ID, or search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');
    const userId = searchParams.get('userId');
    const searchTerm = searchParams.get('search');

    // Validate required parameters
    if (!userId && !noteId) {
      return NextResponse.json(
        { error: "User ID or Note ID is required" },
        { status: 400 }
      );
    }

    // Handle single note retrieval
    if (noteId) {
      const result = await getNoteById(noteId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 404 }
        );
      }
      return NextResponse.json({ note: result.note });
    }

    // Handle search
    if (searchTerm && userId) {
      const result = await searchNotes(userId, searchTerm);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }
      return NextResponse.json({ notes: result.notes });
    }

    // Handle user's notes retrieval
    const result = await getNotesByUserId(userId!);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    return NextResponse.json({ notes: result.notes });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * POST handler: Create a new note
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, content, synopsis } = body;

    // Validate required fields
    if (!userId || !name || !content) {
      return NextResponse.json(
        { error: "User ID, name, and content are required" },
        { status: 400 }
      );
    }

    const result = await createNote(userId, name, content, synopsis);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        note: result.note,
        message: "Note created successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler: Update an existing note
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');
    
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, content, synopsis } = body;
    
    // Ensure there is data to update
    if (!name && !content && synopsis === undefined) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }
    
    const result = await updateNote(noteId, { name, content, synopsis });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Note not found" ? 404 : 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      note: result.note,
      message: "Note updated successfully"
    });
  } catch (error) {
    console.error("Error processing PUT request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler: Delete a note
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');
    
    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }
    
    const result = await deleteNote(noteId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Note not found or already deleted" ? 404 : 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Error processing DELETE request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}