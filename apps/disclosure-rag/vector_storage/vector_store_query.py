from openai import OpenAI
import pandas as pd
import os
from typing import List, Dict, Optional

# Initialize the OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def get_file_by_id(file_id: str, vector_store_id: str) -> Optional[Dict]:
    vector_store_file = client.beta.vector_stores.files.retrieve(
        vector_store_id=vector_store_id,
        file_id=file_id
    )
    print(vector_store_file)
    return vector_store_file


def list_vector_store_files(vector_store_id: str) -> Optional[pd.DataFrame]:
    """
    List all files in a vector store and save them to CSV.

    Args:
        vector_store_id: ID of the vector store to query

    Returns:
        DataFrame containing file information or None if error occurs
    """
    try:
        files = []
        after = None

        # Paginate through all results
        while True:
            response = client.beta.vector_stores.files.list(
                vector_store_id=vector_store_id,
                limit=100,
                after=after
            )
            print(response)
            # Break if no more results
            if not response.data:
                break

            # Filter and extract file info
            for file in response.data:
                file_data = get_file_by_id(file.id, vector_store_id)
                print(file_data)
                files.append(file_data)
                # if getattr(file, 'purpose', None) == 'vectors' and getattr(file, 'vector_store_id', None) == vector_store_id:
                #     file_info.append({
                #         'file_id': file.id,
                #         'filename': file.filename,
                #         'bytes': file.bytes,
                #         'created_at': file.created_at,
                #         'status': file.status
                #     })

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
        print(f"Files saved to {output_file}")

        return df

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None


if __name__ == "__main__":
    # Call the function with vector store ID
    vector_store_id = "vs_meWOEnUiUxtQWf0W6NBsNpCG"
    result = list_vector_store_files(vector_store_id)

    if result is not None:
        print("\nFiles in vector store:")
        print(result)
