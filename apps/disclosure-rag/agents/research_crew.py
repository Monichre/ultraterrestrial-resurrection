
from crewai import Agent, Task, Crew
from langchain.tools import DuckDuckGoSearchRun
from langchain_openai import ChatOpenAI

class ResearchCrew:
    def __init__(self):
        self.search_tool = DuckDuckGoSearchRun()
        self.llm = ChatOpenAI(model="gpt-4-turbo-preview")

    def create_agents(self):
        # Entity Recognition Agent
        entity_analyst = Agent(
            role='Entity Recognition Specialist',
            goal='Identify and classify named entities in the incoming data streams',
            backstory='Expert in NLP and entity recognition with deep knowledge of UFO/UAP domain',
            tools=[self.search_tool],
            llm=self.llm,
            verbose=True
        )

        # Topic Classifier Agent
        topic_analyst = Agent(
            role='Topic Classification Specialist',
            goal='Classify and categorize incoming content into relevant topic areas',
            backstory='Expert in content classification and taxonomy development',
            tools=[self.search_tool],
            llm=self.llm,
            verbose=True
        )

        # Relationship Analyzer Agent
        relationship_analyst = Agent(
            role='Relationship Analysis Specialist',
            goal='Identify and map relationships between entities and topics',
            backstory='Expert in network analysis and relationship mapping',
            tools=[self.search_tool],
            llm=self.llm,
            verbose=True
        )

        return {
            'entity_analyst': entity_analyst,
            'topic_analyst': topic_analyst,
            'relationship_analyst': relationship_analyst
        }

    def create_tasks(self, content, agents):
        tasks = [
            Task(
                description=f"Analyze the following content for named entities: {content}",
                agent=agents['entity_analyst']
            ),
            Task(
                description=f"Classify the main topics in: {content}",
                agent=agents['topic_analyst']
            ),
            Task(
                description=f"Identify relationships between entities and topics in: {content}",
                agent=agents['relationship_analyst']
            )
        ]
        return tasks

    def process_content(self, content):
        agents = self.create_agents()
        tasks = self.create_tasks(content, agents)
        
        crew = Crew(
            agents=list(agents.values()),
            tasks=tasks,
            verbose=True
        )
        
        result = crew.kickoff()
        return result
