import json
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

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
    Uploads a file to the OpenAI vector store.
    """
    try:
        with open(file_path, "rb") as file:
            file_content = file.read()
            response = client.beta.vector_stores.files.upload(
                vector_store_id=vector_store_id, file=(file_path, file_content))
            print(response)
            return response
    except Exception as e:
        print(f"Error uploading file to OpenAI: {e}")
        return None


def generate_embeddings(text):
    """
    Generates embeddings for the given text using OpenAI's embedding model.
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

    response = client.beta.vector_stores.files.upload(
        vector_store_id=vector_store_id, file=(file_path, file_content))
    print(response)

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


# def upload_file_to_openai(file_path):
#       try:
#         with open(file_path, "rb") as file:
#             file_content = file.read()
#             response = client.beta.vector_stores.files.upload(vector_store_id=vector_store_id, file=(file_path, file_content))
#             print(response)
#             return response

#       except Exception as e:
#           print(f"Error uploading file to OpenAI: {e}")
