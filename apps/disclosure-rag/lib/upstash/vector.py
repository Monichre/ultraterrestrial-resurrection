from upstash_vector import Index, Vector
from datetime import datetime

index = Index(url="https://known-bobcat-28794-us1-vector.upstash.io",
              token="ABYFMGtub3duLWJvYmNhdC0yODc5NC11czFhZG1pbllUZ3daREJqT1RRdFpUTmtZUzAwWTJGaExUZzNNelV0WlRGaE9USmxZelJpWXpnMg==")


def generate_vector_id(prefix: str = "vec") -> str:
    """Generate a unique vector ID with timestamp."""
    return f"{prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"


def upload_to_vector_db(full_content: str, summary_content: str, metadata: dict,
                        full_doc_id: str = None, summary_id: str = None) -> dict:
    """
    Upload both full content and summary to Upstash Vector DB with linked metadata.

    Args:
        full_content (str): The complete document content
        summary_content (str): The summary of the document
        metadata (dict): Associated metadata for the vectors
        full_doc_id (str, optional): Custom ID for the full document vector
        summary_id (str, optional): Custom ID for the summary vector

    Returns:
        dict: Response containing both upload operations
    """
    # Generate IDs if not provided
    full_doc_id = full_doc_id or generate_vector_id("doc")
    summary_id = summary_id or generate_vector_id("sum")

    # Enhance metadata with relationship information
    full_doc_metadata = {
        **metadata,
        "vector_type": "full_document",
        "related_summary_id": summary_id,
        "content_length": len(full_content)
    }

    summary_metadata = {
        **metadata,
        "vector_type": "summary",
        "related_document_id": full_doc_id,
        "content_length": len(summary_content)
    }

    try:
        # Upload full document vector
        full_doc_response = index.upsert(
            vectors=[
                Vector(
                    id=full_doc_id,
                    data=full_content,
                    metadata=full_doc_metadata
                )
            ]
        )

        # Upload summary vector
        summary_response = index.upsert(
            vectors=[
                Vector(
                    id=summary_id,
                    data=summary_content,
                    metadata=summary_metadata
                )
            ]
        )

        return {
            "success": True,
            "full_document": {
                "vector_id": full_doc_id,
                "response": full_doc_response
            },
            "summary": {
                "vector_id": summary_id,
                "response": summary_response
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "full_document_id": full_doc_id,
            "summary_id": summary_id
        }


def query_vector_db(query_data: str, top_k: int = 1, vector_type: str = None) -> dict:
    """
    Query the vector database for similar content.

    Args:
        query_data (str): The query text to search for
        top_k (int): Number of results to return
        vector_type (str, optional): Filter by 'full_document' or 'summary'

    Returns:
        dict: Query results with similar vectors
    """
    try:
        # Prepare filter if vector_type is specified
        filter_condition = {
            "vector_type": vector_type} if vector_type else None

        results = index.query(
            data=query_data,
            top_k=top_k,
            include_vectors=True,
            include_metadata=True,
            filter=filter_condition
        )
        return {
            "success": True,
            "results": results
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
