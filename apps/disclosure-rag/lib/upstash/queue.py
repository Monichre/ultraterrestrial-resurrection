from qstash import QStash
import os
import json
from .vector import upload_to_vector_db


def add_processed_content_to_queue(metadata, summary_file, full_content_file=None):
    """
    Add processed content to the queue for further processing.
    First uploads both full content and summary to vector DB, then adds to QStash queue.

    Args:
        metadata (dict): Metadata object containing information about the content
        summary_file (str): Path to the summary file
        full_content_file (str, optional): Path to the full content file
    """
    # Convert summary file to markdown if it's not already
    if not summary_file.endswith('.md'):
        # Get the file content
        with open(summary_file, 'r', encoding='utf-8') as file:
            content = file.read()

        # Create new filename with .md extension
        md_file = os.path.splitext(summary_file)[0] + '.md'

        # Write content to new markdown file
        with open(md_file, 'w', encoding='utf-8') as file:
            file.write(content)

        # Update the summary_file variable to use the markdown file
        summary_file = md_file

    print(f"Converted summary file to markdown: {summary_file}")

    # Read the summary content
    summary_content = ""
    if os.path.exists(summary_file):
        with open(summary_file, 'r', encoding='utf-8') as file:
            summary_content = file.read()

    # Read the full content if available
    full_content = ""
    if full_content_file and os.path.exists(full_content_file):
        with open(full_content_file, 'r', encoding='utf-8') as file:
            full_content = file.read()
    else:
        # If no full content file provided, use summary as full content
        full_content = summary_content

    # Prepare the metadata_file_path (if metadata is a file path string)
    metadata_file_path = None
    if isinstance(metadata, str) and os.path.exists(metadata):
        metadata_file_path = metadata
        # If metadata is a file path, read the content
        with open(metadata, 'r', encoding='utf-8') as file:
            metadata = json.load(file)

    # First, upload both contents to vector DB
    vector_upload_result = upload_to_vector_db(
        full_content=full_content,
        summary_content=summary_content,
        metadata=metadata
    )

    # Add vector IDs to metadata if upload was successful
    if vector_upload_result["success"]:
        metadata["full_document_vector_id"] = vector_upload_result["full_document"]["vector_id"]
        metadata["summary_vector_id"] = vector_upload_result["summary"]["vector_id"]

    client = QStash(os.getenv("QSTASH_TOKEN"))

    # Then proceed with QStash queue
    response = client.message.enqueue_json(
        queue="knowledge-base-data-processing",
        url="https://www.ultraterrestrial.app/api/workflow/processing",
        body={
            "metadata": metadata,
            "metadata_file_path": metadata_file_path,
            "summary_file_path": summary_file,
            "full_content_file_path": full_content_file,
            "summary_content": summary_content,
            "full_content": full_content if len(full_content) <= 10000 else "Content too large for queue",
            "vector_upload_status": vector_upload_result
        },
    )
    print(response)
    return {
        "qstash_response": response,
        "vector_upload": vector_upload_result
    }
