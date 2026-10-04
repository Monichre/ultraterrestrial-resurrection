import os

from failed_files import failed_files
from openai import OpenAI

# Initialize the OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def remove_failed_files(failed_files):
    """
    Iterates through a list of file dictionaries and removes the ones that failed to upload.

    Parameters:
        failed_files (list): A list of dictionaries representing file upload data.
        vector_store_client: A client instance that supports a `delete_file(file_id)` method.
    """
    for file_data in failed_files:
        file_id = file_data.get("id")
        print(file_id)
        try:
            # Attempt to remove the file using the client API.
            client.beta.vector_stores.files.delete(
                vector_store_id="vs_meWOEnUiUxtQWf0W6NBsNpCG",
                file_id=file_id
            )
            print(f"Successfully deleted file with id: {file_id}")
        except Exception as e:
            print(f"Error deleting file {file_id}: {e}")


def get_vector_store():
    vector_store = client.beta.vector_stores.retrieve(
        vector_store_id="vs_meWOEnUiUxtQWf0W6NBsNpCG"
    )

    print(vector_store)


# Example usage:
if __name__ == "__main__":
    # Sample list of failed files (this should be replaced with your actual data)

    # remove_failed_files(failed_files)
    get_vector_store()
