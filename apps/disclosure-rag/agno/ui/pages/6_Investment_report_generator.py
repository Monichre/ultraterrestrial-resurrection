import asyncio

import nest_asyncio
import streamlit as st
from agno.tools.streamlit.components import check_password
from agno.utils.log import logger
from agno.workflow import Workflow

from ui.css import CUSTOM_CSS
from ui.utils import (
    about_agno,
    add_message,
    display_tool_calls,
    initialize_workflow_session_state,
)
from workflows.investment_report_generator import get_investment_report_generator

nest_asyncio.apply()

st.set_page_config(
    page_title="Investment report generator",
    page_icon=":money_with_wings:",
    layout="wide",
)
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
workflow_name = "investment_report_generator"


async def header():
    st.markdown("<h1 class='heading'>Investment report generator</h1>", unsafe_allow_html=True)
    st.markdown(
        "<p class='subheading'>A workflow designed to generate investment reports.</p>",
        unsafe_allow_html=True,
    )


async def body() -> None:
    ####################################################################
    # Initialize Workflow
    ####################################################################
    workflow: Workflow
    if workflow_name not in st.session_state or st.session_state[workflow_name]["workflow"] is None:
        logger.info("---*--- Creating Worfklow ---*---")
        workflow = get_investment_report_generator()
    else:
        workflow = st.session_state[workflow_name]

    ####################################################################
    # Load Workflow Session from the database
    ####################################################################
    try:
        workflow.set_session_id()
        st.session_state[workflow_name]["session_id"] = workflow.load_session()
    except Exception:
        st.warning("Could not create Workflow session, is the database running?")
        return

    ####################################################################
    # Get user input
    ####################################################################
    if prompt := st.chat_input("✨ Give me one or more company names and I'll generate a report about them."):
        await add_message(workflow_name, "user", prompt)

    ####################################################################
    # Display workflow messages
    ####################################################################
    for message in st.session_state[workflow_name]["messages"]:
        if message["role"] in ["user", "assistant"]:
            _content = message["content"]
            if _content is not None:
                with st.chat_message(message["role"]):
                    # Display tool calls if they exist in the message
                    if "tool_calls" in message and message["tool_calls"]:
                        display_tool_calls(st.empty(), message["tool_calls"])
                    st.markdown(_content)

    ####################################################################
    # Generate response for user message
    ####################################################################
    last_message = (
        st.session_state[workflow_name]["messages"][-1] if st.session_state[workflow_name]["messages"] else None
    )
    if last_message and last_message.get("role") == "user":
        user_message = last_message["content"]
        logger.info(f"Responding to message: {user_message}")
        with st.chat_message("assistant"):
            # Create container for tool calls
            tool_calls_container = st.empty()
            resp_container = st.empty()
            with st.spinner(":thinking_face: Working on the report..."):
                response = ""
                try:
                    # Run the team and stream the response
                    run_response = workflow.run_workflow(companies=user_message)
                    for resp_chunk in run_response:
                        # Display tool calls if available
                        if resp_chunk.tools and len(resp_chunk.tools) > 0:
                            display_tool_calls(tool_calls_container, resp_chunk.tools)

                        # Display response
                        if resp_chunk.content is not None:
                            response += resp_chunk.content
                            resp_container.markdown(response)

                    # Add the response to the messages
                    if workflow.run_response is not None:
                        await add_message(workflow_name, "assistant", response, workflow.run_response.tools)
                    else:
                        await add_message(workflow_name, "assistant", response)
                except Exception as e:
                    logger.error(f"Error during workflow run: {str(e)}", exc_info=True)
                    error_message = f"Sorry, I encountered an error: {str(e)}"
                    await add_message(workflow_name, "assistant", error_message)
                    st.error(error_message)


async def main():
    await initialize_workflow_session_state(workflow_name)
    await header()
    await body()
    await about_agno()


if __name__ == "__main__":
    if check_password():
        asyncio.run(main())
