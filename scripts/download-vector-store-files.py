import os
import time
import requests
import mimetypes
from openai import OpenAI
from typing import Dict, Optional, Union
from tqdm import tqdm
from tenacity import retry, stop_after_attempt, wait_exponential

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
VECTOR_STORE_ID = os.environ.get("OPENAI_VECTOR_STORE_ID")

# Constants for rate limiting and retries
MAX_RETRIES = 3
INITIAL_WAIT = 1  # seconds
MAX_WAIT = 10  # seconds

class FileValidationError(Exception):
    """Custom exception for file validation failures"""
    pass

def validate_file_content(content: bytes, expected_mime_type: Optional[str] = None) -> bool:
    """
    Validate downloaded file content
    """
    if not content:
        raise FileValidationError("Empty file content")
    
    if expected_mime_type:
        # Basic magic number checking for common file types
        magic_numbers = {
            'application/pdf': b'%PDF',
            'image/jpeg': b'\xFF\xD8\xFF',
            'image/png': b'\x89PNG',
            'text/plain': None  # Text files don't have magic numbers
        }
        
        if expected_mime_type in magic_numbers and magic_numbers[expected_mime_type]:
            if not content.startswith(magic_numbers[expected_mime_type]):
                raise FileValidationError(f"File content does not match expected type {expected_mime_type}")
    
    return True

@retry(
    stop=stop_after_attempt(MAX_RETRIES),
    wait=wait_exponential(multiplier=INITIAL_WAIT, max=MAX_WAIT),
    reraise=True
)
def get_file_by_id(file_id: str, vector_store_id: str) -> Optional[Dict]:
    """
    Retrieve file metadata from the vector store with retry logic.
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
        raise  # Let retry handle the error

def get_mime_type(filename: str) -> str:
    """
    Determine MIME type from filename
    """
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or 'application/octet-stream'

@retry(
    stop=stop_after_attempt(MAX_RETRIES),
    wait=wait_exponential(multiplier=INITIAL_WAIT, max=MAX_WAIT),
    reraise=True
)
def download_file_content(file_info: Dict) -> Optional[bytes]:
    """
    Download file content with retry logic and progress tracking.
    """
    if not file_info:
        return None

    download_url = file_info.get("download_url")
    if download_url:
        try:
            response = requests.get(download_url, stream=True)
            response.raise_for_status()
            
            # Get total file size for progress bar
            total_size = int(response.headers.get('content-length', 0))
            
            # Initialize progress bar
            progress = tqdm(
                total=total_size,
                unit='iB',
                unit_scale=True,
                desc=f"Downloading {file_info.get('filename', 'file')}"
            )
            
            # Download with progress tracking
            content = bytearray()
            for data in response.iter_content(chunk_size=1024):
                size = len(data)
                content.extend(data)
                progress.update(size)
            progress.close()
            
            return bytes(content)
        except Exception as e:
            print(f"Error downloading file from URL {download_url}: {e}")
            raise  # Let retry handle the error

    # Fallback: if file content is directly embedded
    content = file_info.get("content")
    if content:
        if isinstance(content, str):
            return content.encode()
        return content
    return None

def list_and_download_files(vector_store_id: str, output_dir: str):
    """
    List and download all files with progress tracking and validation.
    """
    os.makedirs(output_dir, exist_ok=True)
    after = None
    total_files = 0
    successful_downloads = 0
    failed_downloads = 0

    # Initialize mimetypes
    mimetypes.init()

    while True:
        try:
            response = client.beta.vector_stores.files.list(
                vector_store_id=vector_store_id,
                limit=100,
                after=after
            )
            
            if not response.data:
                break

            # Create progress bar for batch processing
            batch_progress = tqdm(
                response.data,
                desc="Processing files",
                unit="file"
            )

            for file in batch_progress:
                file_id = file.id
                batch_progress.set_description(f"Processing {file_id}")
                
                # Add delay for rate limiting
                time.sleep(0.1)  # 100ms between API calls
                
                file_info = get_file_by_id(file_id, vector_store_id)
                if file_info is None:
                    failed_downloads += 1
                    continue

                file_data = download_file_content(file_info)
                if file_data is None:
                    print(f"Skipping file {file_id} - unable to download content.")
                    failed_downloads += 1
                    continue

                filename = file_info.get("filename") or file_info.get("name") or f"{file_id}.bin"
                output_path = os.path.join(output_dir, filename)
                
                try:
                    # Validate file content
                    mime_type = get_mime_type(filename)
                    validate_file_content(file_data, mime_type)
                    
                    with open(output_path, "wb") as out_file:
                        out_file.write(file_data)
                    print(f"Saved file '{filename}' to '{output_path}'.")
                    successful_downloads += 1
                    total_files += 1
                except FileValidationError as e:
                    print(f"Validation failed for file {filename}: {e}")
                    failed_downloads += 1
                except Exception as e:
                    print(f"Error saving file {filename}: {e}")
                    failed_downloads += 1

            batch_progress.close()
            after = response.last_id
            if not after:
                break

        except Exception as e:
            print(f"Error processing batch: {e}")
            break

    # Print final summary
    print("\nDownload Summary:")
    print(f"Total files processed: {total_files}")
    print(f"Successfully downloaded: {successful_downloads}")
    print(f"Failed downloads: {failed_downloads}")
    print(f"\nFiles saved to: {output_dir}")

def main():
    if not VECTOR_STORE_ID:
        print("Error: VECTOR_STORE_ID environment variable is not set.")
        return

    output_directory = "downloaded_files"
    list_and_download_files(VECTOR_STORE_ID, output_directory)

if __name__ == "__main__":
    main()
