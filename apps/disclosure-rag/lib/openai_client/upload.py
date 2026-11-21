import json
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

# ═══ YT-CHAIN-A2 · OpenAI contact point #2 (module scope, unconditional) ═══
# knowledge_base_service.py imports upload_file_to_openai at YT-CHAIN-05,
# which executes this module body — so this client is constructed on EVERY
# YouTube run, including runs without --upload and including --dry-run.
# Pair with YT-CHAIN-A1 (content_analysis.py __init__): two OpenAI clients
# built per run, at most one of which is ever used.
# ═══════════════════════════════════════════════════════════════════════════
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)
vector_store_id = os.environ.get("UFO_DATA_STORE_ID")


def chunk_text(text, chunk_size=500, overlap=50):
    """
    Splits 'text' into overlapping chunks of size 'chunk_size'.
    Overlap ensures continuity between chunks.

    :param text: The original text to chunk.
    :param chunk_size: Max length (in chars) of each chunk.
    :param overlap: Number of chars from the previous chunk to include in the next one.
    :return: List of text chunks.
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        # Extract the chunk
        chunk = text[start:end]
        chunks.append(chunk)

        # Move the start pointer forward by chunk_size - overlap
        start += chunk_size - overlap

    return chunks


def upload_file_to_openai(file_path):
    """
    Uploads a file to OpenAI and adds it to the vector store for retrieval.
    
    This function:
    1. Uploads the file to OpenAI Files API
    2. Adds the file to the specified vector store
    3. Returns both file and vector store information

    ═══ YT-CHAIN-15 · upload.py :: upload_file_to_openai() ════════════════
    ✅ THE ONE LEGITIMATE OpenAI CALL ON THIS CHAIN. `files.create` +
    `vector_stores.files.create` — vector STORAGE only. It contains no
    embeddings call; OpenAI embeds server-side inside the vector store.
    Runs only under --upload (YT-CHAIN-14 step 1).
    Contrast with YT-CHAIN-A4 immediately below, which is the embeddings
    call people expect to find here — and which is dead.
    PREV ← YT-CHAIN-14  knowledge_base_service.py Phase 6 sinks
    NEXT → back to YT-CHAIN-14 step 2 (QStash queue)
    ═══════════════════════════════════════════════════════════════════════
    """
    try:
        # First, upload the file to OpenAI
        with open(file_path, "rb") as file:
            file_response = client.files.create(
                file=file,
                purpose="assistants"
            )

        print(f"File uploaded: {file_response.id}")

        # Add the file to the vector store if vector_store_id is configured
        if vector_store_id:
            try:
                vector_file_response = client.vector_stores.files.create(
                    vector_store_id=vector_store_id,
                    file_id=file_response.id
                )
                print(f"File added to vector store: {vector_file_response.id}")
                
                return {
                    'file_id': file_response.id,
                    'vector_store_file_id': vector_file_response.id,
                    'vector_store_id': vector_store_id,
                    'filename': os.path.basename(file_path),
                    'status': 'uploaded_and_indexed'
                }
            except Exception as ve:
                print(f"Warning: File uploaded but failed to add to vector store: {ve}")
                return {
                    'file_id': file_response.id,
                    'filename': os.path.basename(file_path),
                    'status': 'uploaded_only',
                    'error': str(ve)
                }
        else:
            print("Warning: No vector store ID configured. File uploaded but not indexed.")
            return {
                'file_id': file_response.id,
                'filename': os.path.basename(file_path),
                'status': 'uploaded_only',
                'warning': 'No vector store configured'
            }

    except Exception as e:
        print(f"Error uploading file to OpenAI: {e}")
        return {
            'error': str(e),
            'status': 'failed',
            'filename': os.path.basename(file_path) if os.path.exists(file_path) else 'unknown'
        }


def generate_embeddings(text):
    """
    Generates embeddings for the given text using OpenAI's embedding model.

    ═══ YT-CHAIN-A4 · OpenAI embeddings — DEAD CODE, NOT ON ANY CHAIN ═════
    This is the call people go looking for when they ask "why is the ingest
    still embedding against OpenAI?". It is not. Nothing invokes it:
      - Its only caller is process_and_upload_document() below.
      - process_and_upload_document() has ZERO callers repo-wide.
    It would also fail if called. Two defects:
      - `response['data'][0]['embedding']` is the pre-1.0 SDK response shape;
        the modern client returns an object, so this raises TypeError.
      - process_and_upload_document() references an undefined `file_path`.
    See YT-CHAIN-A5 (agents/entity_extraction_agent.py) for the other
    embeddings site, which is likewise off the YouTube path.
    ═══════════════════════════════════════════════════════════════════════
    """
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",  # Select the desired embedding model
            input=text
        )
        embeddings = response['data'][0]['embedding']
        return embeddings
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None


def process_and_upload_document(content_payload):
    """
    Processes the document to generate embeddings and uploads it to the vector store.
    """
    markdown = content_payload['markdown']
    metadata = content_payload['metadata']
    summary = content_payload['summary']
    title = metadata['title']
    url = metadata['url']

    original_chunks = chunk_text(markdown, chunk_size=500, overlap=50)
    summary_chunks = chunk_text(summary, chunk_size=500, overlap=50)

    embedded_original_chunks = [
        generate_embeddings(chunk) for chunk in original_chunks
    ]

    embedded_summary_chunks = [
        generate_embeddings(chunk) for chunk in summary_chunks
    ]

    data_to_upload = {
        "originalChunks": original_chunks,
        "summaryChunks": summary_chunks,
        "embeddedOriginalChunks": embedded_original_chunks,
        "embeddedSummaryChunks": embedded_summary_chunks

    }

    final_json = json.dumps(data_to_upload, indent=2)

    # Upload the file to OpenAI
    file_response = client.files.create(
        file=open(file_path, "rb"),
        purpose="assistants"
    )
    print(f"File uploaded: {file_response}")

    try:
        # Read file content
        with open(file_path, "r") as file:
            document_text = file.read()

        # Generate embeddings
        embeddings = generate_embeddings(document_text)

        # Upload file and embeddings to vector store
        if embeddings:
            response = upload_file_to_openai(file_path)
            print("File and embeddings uploaded successfully.")
            return response
        else:
            print("Failed to generate embeddings for the document.")
            return None
    except Exception as e:
        print(f"Error processing and uploading document: {e}")
        return None

# Example usage
# process_and_upload_document("path/to/your/document.txt")

# Explanation

# 	1.	generate_embeddings: Generates embeddings for the parsed text content using client.embeddings.create. The embedding model used is text-embedding-ada-002, but you can adjust this if needed.
# 	2.	process_and_upload_document: Combines reading, embedding generation, and uploading. It reads the document, generates embeddings for its content, and then uploads it to the vector store using upload_file_to_openai.

# This modular setup allows for embedding generation and file upload in one call, and it logs each step’s success or failure to help with debugging.


# Unused backup code has been removed
