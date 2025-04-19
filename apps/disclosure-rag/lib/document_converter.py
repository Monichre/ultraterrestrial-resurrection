import json
import logging
import os
import time
from pathlib import Path
from typing import Iterable, List

from docling.datamodel.base_models import ConversionStatus
from docling.datamodel.document import ConversionResult
from docling.datamodel.settings import settings
from docling.document_converter import DocumentConverter

converter = DocumentConverter()


def convert_pdf_to_markdown(pdf_path: str) -> str:

    result = converter.convert(pdf_path)
    markdown_file = result.document.export_markdown()
    return markdown_file


def batch_convert_pdf_to_markdown(directory_path: str) -> List[str]:
    convert_these = []
    if not os.path.exists(directory_path):
        raise FileNotFoundError(f"Directory {directory_path} does not exist")
    for file in os.listdir(directory_path):
        if file.endswith(".pdf"):
            pdf_path = os.path.join(directory_path, file)
            convert_these.append(pdf_path)

    results = converter.convert_all(
        convert_these,
        raises_on_error=False,  # to let conversion run through all and examine results at the end
    )
    # write results to directory
    for result in results:
        result.document.export_markdown(output_dir=Path(
            "/knowledge/case_files/markdown"))

    return results
