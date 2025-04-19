from qstash import QStash
import os
import json


def add_processed_content_to_queue(metadata, summary_file):
    """
    Add processed content to the queue for further processing.

    Args:
        metadata (dict): Metadata object containing information about the content
        summary_file (str): Path to the summary file
    """
    client = QStash(os.getenv("QSTASH_TOKEN"))

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

    # Prepare the metadata_file_path (if metadata is a file path string)
    metadata_file_path = None
    if isinstance(metadata, str) and os.path.exists(metadata):
        metadata_file_path = metadata
        # If metadata is a file path, read the content
        with open(metadata, 'r', encoding='utf-8') as file:
            metadata = json.load(file)

    response = client.message.enqueue_json(
        queue="knowledge-base-data-processing",
        url="https://www.ultraterrestrial.app/api/workflow/processing",
        body={
            "metadata": metadata,
            "metadata_file_path": metadata_file_path,
            "summary_file_path": summary_file,
            "summary_content": summary_content,
        },
    )
    print(response)
    return response
