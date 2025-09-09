import asyncio

import nest_asyncio
import streamlit as st
from agno.team import Team
from agno.tools.streamlit.components import check_password
from agno.utils.log import logger

from teams.multi_language import get_multi_language_team
from ui.css import CUSTOM_CSS
from ui.utils import (
    about_agno,
    add_message,
    display_tool_calls,
    example_inputs,
    initialize_team_session_state,
    selected_model,
)

nest_asyncio.apply()

st.set_page_config(
    page_title="Multi-language Team",
    page_icon=":speaking_head:",
    layout="wide",
)
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
team_name = "multi_language_team"


async def header():
    st.markdown("<h1 class='heading'>Multi-language Team</h1>", unsafe_allow_html=True)
    st.markdown(
        "<p class='subheading'>A team of agents designed to answer questions in different languages.</p>",
        unsafe_allow_html=True,
    )


async def body() -> None:
    ####################################################################
    # Initialize User and Session State
    ####################################################################
    user_id = st.sidebar.text_input(":technologist: Username", value="Ava")

    ####################################################################
    # Model selector
    ####################################################################
    model_id = await selected_model()

    ####################################################################
    # Initialize Team
    ####################################################################
    team: Team
    if (
        team_name not in st.session_state
        or st.session_state[team_name]["team"] is None
        or st.session_state.get("selected_model") != model_id
    ):
        logger.info("---*--- Creating Team ---*---")
        team = get_multi_language_team(user_id=user_id, model_id=model_id)
        st.session_state[team_name]["team"] = team
        st.session_state["selected_model"] = model_id
    else:
        team = st.session_state[team_name]["team"]

    ####################################################################
    # Load Team Session from the database
    ####################################################################
    try:
        st.session_state[team_name]["session_id"] = team.load_session()
    except Exception:
        st.warning("Could not create Team session, is the database running?")
        return

    ####################################################################
    # Get user input
    ####################################################################
    if prompt := st.chat_input("✨ How can I help, bestie?"):
        await add_message(team_name, "user", prompt)

    ####################################################################
    # Show example inputs
    ####################################################################
    await example_inputs(team_name)

    ####################################################################
    # Display team messages
    ####################################################################
    for message in st.session_state[team_name]["messages"]:
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
    last_message = st.session_state[team_name]["messages"][-1] if st.session_state[team_name]["messages"] else None
    if last_message and last_message.get("role") == "user":
        user_message = last_message["content"]
        logger.info(f"Responding to message: {user_message}")
        with st.chat_message("assistant"):
            # Create container for tool calls
            tool_calls_container = st.empty()
            resp_container = st.empty()
            with st.spinner(":thinking_face: Thinking..."):
                response = ""
                try:
                    # Run the team and stream the response
                    run_response = await team.arun(user_message, stream=True)
                    async for resp_chunk in run_response:
                        # Display tool calls if available
                        if resp_chunk.tools and len(resp_chunk.tools) > 0:
                            display_tool_calls(tool_calls_container, resp_chunk.tools)

                        # Display response
                        if resp_chunk.content is not None:
                            response += resp_chunk.content
                            resp_container.markdown(response)

                    # Add the response to the messages
                    if team.run_response is not None:
                        await add_message(team_name, "assistant", response, team.run_response.tools)
                    else:
                        await add_message(team_name, "assistant", response)
                except Exception as e:
                    logger.error(f"Error during team run: {str(e)}", exc_info=True)
                    error_message = f"Sorry, I encountered an error: {str(e)}"
                    await add_message(team_name, "assistant", error_message)
                    st.error(error_message)


async def main():
    await initialize_team_session_state(team_name)
    await header()
    await body()
    await about_agno()


if __name__ == "__main__":
    if check_password():
        asyncio.run(main())
