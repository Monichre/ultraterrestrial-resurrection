import os
import json
import subprocess
from typing import Dict, List, Optional
import pandas as pd
from openai import OpenAI

# Initialize the OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def get_file_by_id(file_id: str, vector_store_id: str) -> Optional[Dict]:
    vector_store_file = client.beta.vector_stores.files.retrieve(
        vector_store_id=vector_store_id,
        file_id=file_id
    )
    return vector_store_file


def download_file_with_curl(file_id: str, vector_store_id: str, output_path: str) -> bool:
    """
    Download file content using curl command.

    Args:
        file_id: ID of the file to retrieve
        vector_store_id: ID of the vector store containing the file
        output_path: Path to save the file

    Returns:
        True if successful, False otherwise
    """
    try:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            print("OPENAI_API_KEY environment variable not set")
            return False

        # Construct curl command using the exact format provided
        curl_cmd = [
            "curl",
            f"https://api.openai.com/v1/vector_stores/{vector_store_id}/files/{file_id}/content",
            "-H", f"Authorization: Bearer {api_key}",
            "--output", output_path
        ]

        # Execute curl command
        result = subprocess.run(
            curl_cmd,
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print(f"Successfully downloaded file {file_id} to {output_path}")
            return True
        else:
            print(f"Failed to download file {file_id}: {result.stderr}")
            return False
    except Exception as e:
        print(f"Error downloading file {file_id}: {str(e)}")
        return False


def save_file_contents(file_id: str, filename: str, vector_store_id: str, output_dir: str = "vector_store_files"):
    """
    Save file contents to a local file using curl.

    Args:
        file_id: ID of the file
        filename: Original filename (if available)
        vector_store_id: ID of the vector store
        output_dir: Directory to save files in
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Create a safe filename
    safe_name = filename if filename else f"{file_id}.txt"
    safe_name = safe_name.replace("/", "_").replace("\\", "_")
    output_path = os.path.join(output_dir, safe_name)

    return download_file_with_curl(file_id, vector_store_id, output_path)


def list_vector_store_files(vector_store_id: str, download_contents: bool = False) -> Optional[pd.DataFrame]:
    """
    List all files in a vector store and save them to CSV.
    If download_contents is True, also download and save file contents.

    Args:
        vector_store_id: ID of the vector store to query
        download_contents: Whether to download file contents

    Returns:
        DataFrame containing file information or None if error occurs
    """
    try:
        files = []
        after = None
        output_dir = "vector_store_files"

        # Ensure output directory exists if downloading
        if download_contents:
            os.makedirs(output_dir, exist_ok=True)
            print(f"Will download file contents to {output_dir}")

        # Paginate through all results
        while True:
            response = client.beta.vector_stores.files.list(
                vector_store_id=vector_store_id,
                limit=100,
                after=after
            )
            print(f"Found {len(response.data)} files in this batch")

            # Break if no more results
            if not response.data:
                break

            # Filter and extract file info
            for file in response.data:
                file_data = get_file_by_id(file.id, vector_store_id)

                file_info = {
                    'file_id': file.id,
                    'filename': getattr(file, 'filename', f"{file.id}.txt"),
                    'bytes': getattr(file, 'bytes', 0),
                    'created_at': file.created_at,
                    'status': file.status
                }
                files.append(file_info)

                print(
                    f"Processing file: {file_info['file_id']} ({file_info['filename']})")

                # Download file contents if requested
                if download_contents and file.status == 'completed':
                    try:
                        success = save_file_contents(
                            file.id,
                            file_info['filename'],
                            vector_store_id,
                            output_dir
                        )
                        if not success:
                            print(
                                f"Skipping file {file.id} due to download error")
                    except Exception as e:
                        print(f"Failed to download file {file.id}: {str(e)}")

            # Get cursor for next page
            after = response.last_id

            # Break if no more pages
            if not after:
                break

        # Convert to DataFrame
        df = pd.DataFrame(files)

        # Save to CSV
        output_file = 'vector_store_file_data.csv'
        df.to_csv(output_file, index=False)
        print(f"Files info saved to {output_file}")
        if download_contents:
            print(f"File contents saved to {output_dir} directory")

        return df

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None


if __name__ == "__main__":
    # Call the function with vector store ID
    vector_store_id = "vs_meWOEnUiUxtQWf0W6NBsNpCG"
    # Set to True to download file contents
    download_contents = True
    result = list_vector_store_files(vector_store_id, download_contents)

    if result is not None:
        print("\nFiles in vector store:")
        print(result)
