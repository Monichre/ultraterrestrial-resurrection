import os
import requests
from openai import OpenAI
from typing import Dict, Optional

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
VECTOR_STORE_ID = os.environ.get("OPENAI_VECTOR_STORE_ID")


def get_file_by_id(file_id: str, vector_store_id: str) -> Optional[Dict]:
    """
    Retrieve file metadata from the vector store.
    """
    try:
        vector_store_file = client.beta.vector_stores.files.retrieve(
            vector_store_id=vector_store_id,
            file_id=file_id
        )
        print(f"Retrieved file info for {file_id}: {vector_store_file}")
        return vector_store_file
    except Exception as e:
        print(f"Error retrieving file {file_id}: {e}")
        return None


def download_file_content(file_info: Dict) -> Optional[bytes]:
    """
    Given the file info returned from get_file_by_id, download its content.
    It will first try to use a 'download_url' field, if provided, or fall back 
    to a direct 'content' field.
    """
    if not file_info:
        return None

    download_url = file_info.get("download_url")
    if download_url:
        try:
            response = requests.get(download_url, stream=True)
            response.raise_for_status()
            # Read and return the binary content
            return response.content
        except Exception as e:
            print(f"Error downloading file from URL {download_url}: {e}")
            return None

    # Fallback: if file content is directly embedded in the metadata.
    content = file_info.get("content")
    if content:
        if isinstance(content, str):
            # Modify decoding if needed.
            return content.encode()
        return content
    return None


def list_and_download_files(vector_store_id: str, output_dir: str):
    """
    List all files in the given vector store (with pagination) and
    attempt to download each file's content. Each file is saved to output_dir.
    """
    os.makedirs(output_dir, exist_ok=True)
    after = None
    total_files = 0

    while True:
        try:
            response = client.beta.vector_stores.files.list(
                vector_store_id=vector_store_id,
                limit=100,
                after=after
            )
        except Exception as e:
            print(f"Error listing files: {e}")
            break

        if not response.data:
            break

        for file in response.data:
            file_id = file.id  # Using the file object property
            # Retrieve detailed file information
            file_info = get_file_by_id(file_id, vector_store_id)
            if file_info is None:
                continue

            # Attempt to download the file data using either a download URL or direct content field.
            file_data = download_file_content(file_info)
            if file_data is None:
                print(f"Skipping file {file_id} - unable to download content.")
                continue

            # Determine the filename. Use file_info's filename field if available; otherwise, use file.id.
            filename = file_info.get("filename") or file_info.get(
                "name") or f"{file_id}.bin"
            # Optionally, you might append an extension (e.g., from metadata) if not already present.
            output_path = os.path.join(output_dir, filename)

            try:
                with open(output_path, "wb") as out_file:
                    out_file.write(file_data)
                print(f"Saved file '{filename}' to '{output_path}'.")
                total_files += 1
            except Exception as e:
                print(f"Error saving file {filename}: {e}")

        after = response.last_id
        if not after:
            break

    print(
        f"\nDownloaded {total_files} files from vector store {vector_store_id}.")


def main():
    if not VECTOR_STORE_ID:
        print("Error: VECTOR_STORE_ID environment variable is not set.")
        return

    output_directory = "downloaded_files"
    list_and_download_files(VECTOR_STORE_ID, output_directory)


if __name__ == "__main__":
    main()
