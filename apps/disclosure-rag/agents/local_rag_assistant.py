# import os

# import streamlit as st
# from dotenv import load_dotenv
# from langchain_community.document_loaders import (JSONLoader, PDFPlumberLoader,
#                                                   UnstructuredMarkdownLoader)
# from langchain_core.documents import Document
# from langchain_core.prompts import ChatPromptTemplate

# from langchain_ollama.llms import OllamaLLM
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from openai import OpenAI
# from streamlit_file_browser import st_file_browser

# load_dotenv()
# markdown_path = os.environ.get('TRANSCRIPT_DIRECTORY_PATH', '*.json')

# loader = UnstructuredMarkdownLoader(markdown_path)

# template = """
# You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
# Question: {question} 
# Context: {context} 
# Answer:
# """

# pdfs_directory = os.environ.get('CASE_FILES_DIRECTORY_PATH')
# transcripts_directory = os.environ.get('TRANSCRIPT_DIRECTORY_PATH')
# print(pdfs_directory)

# model = OpenAI(
#     api_key=os.getenv("DEEPSEEK_API_KEY"),
#     base_url="https://api.deepseek.com"
# )  # Configure for DeepSeek API


# def upload_pdf(file):
#     with open(pdfs_directory + file.name, "wb") as f:
#         f.write(file.getbuffer())

# def load_pdf(file_path):
#     loader = PDFPlumberLoader(file_path)
#     documents = loader.load()

#     return documents

# def split_text(documents):
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=1000,
#         chunk_overlap=200,
#         add_start_index=True
#     )

#     return text_splitter.split_documents(documents)

# def index_docs(documents):
#     vector_store.add_documents(documents)

# def retrieve_docs(query):
#     return vector_store.similarity_search(query)

# def answer_question(question, documents):
#     context = "\n\n".join([doc.page_content for doc in documents])
#     prompt = ChatPromptTemplate.from_template(template)
#     chain = prompt | model

#     return chain.invoke({"question": question, "context": context})


# # st.dataframe(
# # pd.DataFrame({
# #     'Files': [f for f in os.listdir(pdfs_directory) if f.endswith('.pdf')],
# #     'Size (KB)': [round(os.path.getsize(os.path.join(pdfs_directory, f)) / 1024, 2) 
# #                   for f in os.listdir(pdfs_directory) if f.endswith('.pdf')]
# # })
# # )

# #  "..","knowledge", "case-files"
# # current_path = os.environ.get("TRANSCRIPT_DIRECTORY_PATH")
# # # os.path.join(os.environ.get("TRANSCRIPT_DIRECTORY_PATH"), "..", "case-files")
# # print(current_path)
# # st.write(current_path)

# pdfs_directory = os.environ.get('CASE_FILES_DIRECTORY_PATH')
# transcripts_directory = os.environ.get('TRANSCRIPT_DIRECTORY_PATH')

# # Optional: Check if the pdfs_directory is properly set
# if pdfs_directory is None:
#     st.error("CASE_FILES_DIRECTORY_PATH is not set in the environment.")
#     st.stop()  # Stop further execution if the directory is missing

# st.header('Case Files Browser')

# # Call the file browser widget/function with the correct parameters
# case_files_event = st_file_browser(
#     pdfs_directory,
#     key="case_files",
#     use_static_file_server=True,
#     show_choose_file=True,
#     show_delete_file=True,
#     show_download_file=True,
#     show_new_folder=True,
#     show_upload_file=True,
#     glob_patterns=('*.pdf',),
#     static_file_server_path="http://localhost:9999/case-files",
# )
# # Optionally, handle the case_files_event result as needed
# if case_files_event is not None:
#     st.write("File event data:", case_files_event)

# st.header('Transcripts Browser')
# transcripts_event = st_file_browser(
#     transcripts_directory,
#     key="transcripts",
#     use_static_file_server=True,
#     show_choose_file=True,
#     show_delete_file=True,
#     show_download_file=True,
#     show_new_folder=True,
#     show_upload_file=True,
#     static_file_server_path="http://localhost:9999/transcripts",
# )
# st.write(transcripts_event)

# uploaded_file = st.file_uploader(
#     "Upload PDF",
#     type="pdf",
#     accept_multiple_files=False
# )

# if uploaded_file:
#     upload_pdf(uploaded_file)
#     documents = load_pdf(pdfs_directory + uploaded_file.name)
#     chunked_documents = split_text(documents)
#     index_docs(chunked_documents)

#     question = st.chat_input()

#     if question:
#         st.chat_message("user").write(question)
#         related_documents = retrieve_docs(question)
#         answer = answer_question(question, related_documents)
#         st.chat_message("assistant").write(answer)

import os

import numpy as np
import pandas as pd
import streamlit as st
from dotenv import load_dotenv
# import streamlit as st
# from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain_community.document_loaders import JSONLoader, PDFPlumberLoader
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_ollama import OllamaEmbeddings
from langchain_ollama.llms import OllamaLLM
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from openai import OpenAI
from streamlit_file_browser import st_file_browser

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector_store = InMemoryVectorStore(embeddings)
# from langchain.docstore.document import Document
# # Import loaders, vector store, embeddings, LLM, and chain from LangChain.
# from langchain.document_loaders import (JSONLoader, PDFPlumberLoader,
#                                         UnstructuredMarkdownLoader)
# from langchain.embeddings import HuggingFaceEmbeddings
# from langchain.llms import GPT4All
# from langchain.prompts import ChatPromptTemplate
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.vectorstores import InMemoryVectorStore
# from streamlit_file_browser import st_file_browser


# Load environment variables
load_dotenv()

# (Optional) Load markdown files – not used directly below.
# markdown_path = os.environ.get('TRANSCRIPT_DIRECTORY_PATH', '*.json')
# loader = UnstructuredMarkdownLoader(markdown_path)

# Define a prompt template for answering questions.
template = """
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:
"""

# Retrieve directories from environment variables
pdfs_directory = os.environ.get('CASE_FILES_DIRECTORY_PATH')
transcripts_directory = os.environ.get('TRANSCRIPT_DIRECTORY_PATH')

# Ensure the CASE_FILES_DIRECTORY_PATH is set.
if not pdfs_directory:
    st.error("CASE_FILES_DIRECTORY_PATH is not set in the environment.")
    st.stop()



# Set up a local LLM model using GPT4All.

model = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)  # Configure for DeepSeek API


def upload_pdf(file):
    """Save the uploaded PDF to the designated directory."""
    file_path = os.path.join(pdfs_directory, file.name)
    with open(file_path, "wb") as f:
        f.write(file.getbuffer())


def load_pdf(file_path):
    """Load a PDF and return its documents using PDFPlumber."""
    pdf_loader = PDFPlumberLoader(file_path)
    documents = pdf_loader.load()
    return documents


def split_text(documents):
    """Split documents into chunks for more efficient indexing and retrieval."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True
    )
    return text_splitter.split_documents(documents)


def index_docs(documents):
    """Add documents to the in-memory vector store."""
    vector_store.add_documents(documents)


def retrieve_docs(query):
    """Retrieve similar documents from the vector store for a given query."""
    return vector_store.similarity_search(query)


def answer_question(question, documents):
    """Generate an answer for a question using retrieved documents."""
    # Concatenate the content from all documents.
    context = "\n\n".join([doc.page_content for doc in documents])
    prompt_template = ChatPromptTemplate.from_template(template)
    chain = LLMChain(llm=model, prompt=prompt_template)
    return chain.run(question=question, context=context)


# Display the Case Files Browser using Streamlit file browser widget.
# st.header('Case Files Browser')
# case_files_event = st_file_browser(
#     pdfs_directory,
#     key="case_files",
#     use_static_file_server=True,
#     show_choose_file=True,
#     show_delete_file=True,
#     show_download_file=True,
#     show_new_folder=True,
#     show_upload_file=True,
#     glob_patterns=('*.pdf',),   
#     # static_file_server_path="http://localhost:8502case-files",
# )
# if case_files_event is not None:
#     st.write("File event data:", case_files_event)

# # Display the Transcripts Browser.
# st.header('Transcripts Browser')
# transcripts_event = st_file_browser(
#     transcripts_directory,
#     key="transcripts",
#     use_static_file_server=True,
#     show_choose_file=True,
#     show_delete_file=True,
#     show_download_file=True,
#     show_new_folder=True,
#     show_upload_file=True,
#     static_file_server_path="knowledge/transcripts",
# )
# st.write(transcripts_event)

# Allow the user to upload a PDF.
selected_case_file = st.selectbox("Select a file", [f for f in os.listdir(pdfs_directory) if f.endswith('.pdf')])
st.write(selected_case_file)

selected_transcript_file = st.selectbox("Select a transcript", [f for f in os.listdir(transcripts_directory) if f.endswith('.json')])
st.write(selected_transcript_file)

uploaded_file = st.file_uploader("Upload PDF", type="pdf", accept_multiple_files=False)
st.write(uploaded_file)

# Create a table view of PDF files in the directory
pdf_files = []
for file in os.listdir(pdfs_directory):
    if file.endswith('.pdf'):
        file_path = os.path.join(pdfs_directory, file)
        documents = load_pdf(file_path)
        print(documents)
        st.write(documents)
        chunked_documents = split_text(documents)
        index_docs(chunked_documents)
        
        file_stats = os.stat(file_path)
        pdf_files.append({
            'Filename': file,
            'Size (KB)': round(file_stats.st_size / 1024, 2),
        })

if pdf_files:
    st.subheader('Available PDF Files')
    st.table(pd.DataFrame(pdf_files))
else:
    st.info('No PDF files found in the directory')

transcript_files = []

# Walk through all subdirectories recursively
for root, dirs, files in os.walk(transcripts_directory):
    for file in files:
        if file.endswith('.txt'):
            file_path = os.path.join(root, file)
            file_stats = os.stat(file_path)
            # Get relative path from transcripts_directory
            rel_path = os.path.relpath(file_path, transcripts_directory)
            documents = load_pdf(file_path)
            print(documents)
            st.write(documents)
            chunked_documents = split_text(documents)
            index_docs(chunked_documents)
        
            transcript_files.append({
                'Title': open(file_path).readline().strip() if os.path.exists(file_path) else rel_path,
                'Filename': rel_path,
                'Size (KB)': round(file_stats.st_size / 1024, 2),
            })

if transcript_files:
    st.subheader('Available Transcript Files')
    st.table(pd.DataFrame(transcript_files))
else:
    st.info('No transcript files found in the directory')



if uploaded_file:
    upload_pdf(uploaded_file)
    file_path = os.path.join(pdfs_directory + "/", uploaded_file.name) # type: ignore
    documents = load_pdf(file_path)
    print(documents)
    st.write(documents)
    chunked_documents = split_text(documents)
    index_docs(chunked_documents)

    # Get a question from the user via chat input.
question = st.chat_input()
if question:
    st.chat_message("user").write(question)
    related_documents = retrieve_docs(question)
    answer = answer_question(question, related_documents)
    st.chat_message("assistant").write(answer)