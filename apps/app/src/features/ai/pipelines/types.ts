import { z } from "zod";

export type AgentPattern =
	| "sequential"
	| "routing"
	| "parallel"
	| "orchestrator"
	| "evaluator";

export interface InputField {
	name: string;
	type: "textarea" | "input";
	label: string;
	placeholder: string;
}

export interface AgentType {
	name: string;
	id: string;
	description: string;
	input: string;
	output: string;
	parameter: string;
	context: string;
	inputFields: InputField[];
	resultTabs: string[];
	tools?: Array<{ name: string; description: string }>;
	steps?: string[];
	routes?: string[];
	workers?: string[];
	phases?: string[];
	maxIterations?: number;
	averageTime?: number;
	capabilities?: string[];
}

export interface AgentConfig {
	pattern: AgentPattern;
	maxSteps: number;
	model: string;
	temperature: number;
}

export interface AgentResult {
	text: string;
	steps: AgentStep[];
	toolCalls: ToolCall[];
	usage: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

export interface AgentStep {
	text: string;
	toolCalls?: ToolCall[];
	toolResults?: any[];
	finishReason: string;
}

export interface ToolCall {
	type: string;
	name: string;
	parameters: Record<string, any>;
	result?: any;
}

export type AgentResponse = string | { images: any[]; error: Error };

// Add new type definitions
export type ExamplePrompt = {
	prompt?: string;
	content?: string;
	query?: string;
	requirements?: string;
	[key: string]: string | undefined; // Allow for additional string fields
};

// Zod schemas for validation
export const agentConfigSchema = z.object({
	pattern: z.enum([
		"sequential",
		"routing",
		"parallel",
		"orchestrator",
		"evaluator",
	]),
	maxSteps: z.number().min(1).max(20),
	model: z.string(),
	temperature: z.number().min(0).max(2),
});

export const agentResultSchema = z.object({
	text: z.string(),
	steps: z.array(
		z.object({
			text: z.string(),
			toolCalls: z
				.array(
					z.object({
						type: z.string(),
						name: z.string(),
						parameters: z.record(z.any()),
						result: z.any().optional(),
					}),
				)
				.optional(),
			toolResults: z.array(z.any()).optional(),
			finishReason: z.string(),
		}),
	),
	toolCalls: z.array(
		z.object({
			type: z.string(),
			name: z.string(),
			parameters: z.record(z.any()),
			result: z.any().optional(),
		}),
	),
	usage: z.object({
		promptTokens: z.number(),
		completionTokens: z.number(),
		totalTokens: z.number(),
	}),
});

export const agentTypes = [
	{
		name: "Sequential Processing",
		id: "sequential-processing",
		description:
			"Advanced content transformation pipeline that processes input through carefully orchestrated stages: Deep Analysis → Smart Summarization → Intelligent Conclusion. Each stage builds upon the previous, ensuring cohesive and thorough processing.",
		input: "Text content with optional processing instructions",
		output: "Processed result with detailed stage outputs and transformations",
		parameter:
			"processingDepth (default: standard, options: light, standard, deep)",
		context:
			"Ideal for content transformation workflows requiring multiple processing stages",
		inputFields: [
			{
				name: "content",
				type: "textarea" as const,
				label: "Content to Process",
				placeholder: `Enter content for sequential processing through multiple sophisticated stages:

Example inputs:

1. Technical Documentation:
   "## API Authentication
    This service uses OAuth 2.0 for authentication.
    Supported grant types include:
    - Authorization Code
    - Client Credentials
    - Refresh Token"
   Instructions: "Convert to user-friendly guide with examples"

2. Research Analysis:
   "Recent studies show correlation between sleep patterns and cognitive performance in software developers..."
   Instructions: "Extract key findings, analyze methodology, suggest applications"

3. Code Transformation:
   "class UserAuth {
      constructor(private readonly db: Database) {}
      async validateUser(credentials: Credentials): Promise<boolean> {
        // Implementation
      }
   }"
   Instructions: "Convert to functional approach, add error handling, optimize"`,
			},
		],
		resultTabs: ["response", "steps", "analysis"],
		steps: ["Analyze", "Summarize", "Conclude"],
		capabilities: [
			"Three-stage sequential pipeline",
			"Deep content analysis",
			"Smart summarization",
			"Instruction-based conclusion",
			"Cumulative processing (each step uses previous output)",
			"Token usage tracking per stage",
			"Progress monitoring across stages",
		],
		averageTime: 62,
	},
	{
		name: "Routing",
		id: "routing",
		description:
			"Intelligent query routing system that analyzes and directs requests to specialized expert agents. Uses advanced classification to ensure optimal handling of each query type: General Knowledge, Technical Expertise, or Creative Generation.",
		input: "Query or request in natural language",
		output: "Classified and processed response with routing explanation",
		parameter:
			"routingPrecision (default: balanced, options: speed, accuracy, balanced)",
		context:
			"Perfect for systems requiring intelligent request handling and specialized processing",
		inputFields: [
			{
				name: "query",
				type: "textarea" as const,
				label: "Query",
				placeholder: `Enter your query. The router will analyze and direct it to the most qualified specialist:

Example queries:

1. General Knowledge:
   "Explain the impact of the Renaissance on modern European architecture, focusing on:
   - Key architectural innovations
   - Influential architects
   - Lasting cultural impact"

2. Technical:
   "Design a scalable microservices architecture for a real-time analytics platform:
   - Handle 10k events/second
   - Ensure data consistency
   - Implement fault tolerance
   - Consider cloud deployment"

3. Creative:
   "Create an engaging story about a quantum physicist who discovers:
   - Time flows differently in dreams
   - Dreams can affect reality
   - Past and future intersect
   Theme: The nature of consciousness and reality"`,
			},
		],
		resultTabs: ["response", "classification", "routing-path"],
		routes: ["general", "technical", "creative"],
		capabilities: [
			"Two-phase processing: classification and response",
			"Content-based query classification",
			"Specialized prompt selection",
			"Expert persona adaptation",
			"Aggregated token usage tracking",
			"Classification reasoning",
		],
		averageTime: 24,
	},
	{
		name: "Parallel Processing",
		id: "parallel-processing",
		description:
			"High-performance content analysis system that simultaneously processes multiple aspects of input using specialized parallel workers. Each worker focuses on specific dimensions while maintaining context awareness.",
		input: "Content with analysis dimensions",
		output: "Multi-dimensional analysis results with cross-referenced insights",
		parameter: "parallelDepth (default: 3, range: 2-5)",
		context:
			"Optimal for complex analysis requiring multiple simultaneous perspectives",
		inputFields: [
			{
				name: "content",
				type: "textarea" as const,
				label: "Content for Analysis",
				placeholder: `Enter content for comprehensive parallel analysis across multiple dimensions:

Example analyses:

1. Technology Impact Analysis:
   "The emergence of large language models in AI has transformed multiple industries..."
   Aspects: technical_capabilities,societal_impact,ethical_considerations,future_implications,economic_effects

2. Market Research:
   "Electric vehicle adoption rates have accelerated across major markets..."
   Aspects: market_trends,consumer_behavior,infrastructure_requirements,competitive_landscape,regulatory_environment

3. Scientific Paper Analysis:
   "Recent breakthroughs in quantum computing demonstrate potential for..."
   Aspects: methodology_review,results_validation,impact_assessment,future_applications,limitations`,
			},
			{
				name: "aspects",
				type: "input" as const,
				label: "Analysis Dimensions",
				placeholder:
					"Comma-separated analysis dimensions (e.g., technical_depth,market_impact,future_potential,risk_assessment)",
			},
		],
		resultTabs: ["response", "parallel-results", "metadata"],
		workers: ["Summary", "Analysis", "Critique"],
		capabilities: [
			"Concurrent analysis execution",
			"Customizable analysis aspects",
			"Visual task metadata (icons/colors)",
			"Input statistics tracking",
			"Timestamp recording",
			"Aggregated token usage",
			"Dynamic worker allocation",
		],
		averageTime: 90,
	},
	{
		name: "Orchestrator Worker",
		id: "orchestrator-worker",
		description:
			"Advanced project management agent that coordinates multiple specialized workers to execute complex, multi-stage projects. Handles task distribution, dependency management, and result integration.",
		input: "Detailed project requirements and constraints",
		output: "Comprehensive project execution plan and coordinated results",
		parameter:
			"orchestrationDepth (default: standard, options: light, standard, comprehensive)",
		context:
			"Ideal for complex projects requiring coordination of multiple specialized skills and careful orchestration",
		inputFields: [
			{
				name: "requirements",
				type: "textarea" as const,
				label: "Project Requirements",
				placeholder: `Describe your project requirements in detail. The orchestrator will:

Example projects:

1. E-commerce Platform Development:
   "Build a high-performance e-commerce platform with:
   - Microservices architecture
   - Real-time inventory management
   - AI-powered recommendation system
   - Multi-region deployment
   - Advanced analytics dashboard"

2. ML Pipeline Implementation:
   "Create an end-to-end machine learning pipeline for:
   - Real-time fraud detection
   - Model training automation
   - Performance monitoring
   - A/B testing framework
   - Model versioning system"

3. Cloud Migration Project:
   "Migrate legacy system to cloud infrastructure:
   - Zero-downtime migration
   - Data integrity verification
   - Performance optimization
   - Security compliance
   - Monitoring setup"`,
			},
			{
				name: "constraints",
				type: "textarea" as const,
				label: "Project Constraints",
				placeholder: `Specify project constraints and requirements:

Example constraints:

1. Technical Constraints:
   - Maximum latency: 100ms
   - 99.99% uptime requirement
   - GDPR compliance needed
   - Must support 100k concurrent users

2. Resource Constraints:
   - Budget: $200k
   - Timeline: 3 months
   - Team size: 8 developers
   - Cloud provider: AWS

3. Business Constraints:
   - Must integrate with existing systems
   - Regular stakeholder updates required
   - Phased rollout approach
   - ROI metrics tracking`,
			},
		],
		resultTabs: ["plan", "results", "metrics"],
		phases: [
			"Plan Generation",
			"Task Distribution",
			"Parallel Execution",
			"Result Aggregation",
		],
		capabilities: [
			"Two-phase execution: planning and execution",
			"Dynamic task planning with zod schema",
			"Parallel worker execution",
			"Constraint-aware processing",
			"Aggregated token usage tracking",
			"Task-specific worker assignment",
		],
		averageTime: 46,
	},
	{
		name: "Evaluator Optimizer",
		id: "evaluator-optimizer",
		description:
			"Sophisticated content optimization system that iteratively improves input through multiple evaluation and enhancement cycles. Uses advanced metrics and domain-specific knowledge for targeted improvements.",
		input: "Initial content and optimization criteria",
		output: "Optimized content with improvement history and quality metrics",
		parameter: "optimizationCycles (default: 3, range: 1-5)",
		context:
			"Perfect for scenarios requiring iterative improvement and quality optimization",
		inputFields: [
			{
				name: "content",
				type: "textarea" as const,
				label: "Content to Optimize",
				placeholder: `Enter the content you want to optimize. The agent will iteratively improve it:

Example optimization tasks:

1. Database Query Optimization:
   "WITH UserOrders AS (
      SELECT u.id, COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE o.status = 'completed'
      GROUP BY u.id
   )
   SELECT * FROM UserOrders WHERE order_count > 10"

2. React Component Enhancement:
   "export function DataGrid({ data, columns, onSort, onFilter }) {
      const [sortedData, setSortedData] = useState(data);
      const [filters, setFilters] = useState({});
      
      // Basic implementation
      return (
        <div className='grid'>
          {sortedData.map(row => (
            <div key={row.id}>{/* Row content */}</div>
          ))}
        </div>
      );
   }"

3. Marketing Copy Optimization:
   "Introducing CloudScale: The next-generation cloud platform
    - Fast and reliable
    - Easy to use
    - Advanced features
    - Great support
    Perfect for businesses of all sizes."`,
			},
			{
				name: "criteria",
				type: "textarea" as const,
				label: "Optimization Criteria",
				placeholder: `Specify detailed optimization criteria:

Example criteria:

1. Code Optimization:
   - Performance metrics
   - Memory efficiency
   - Code readability
   - Error handling
   - Security best practices
   - Testing coverage

2. Content Optimization:
   - Clarity and coherence
   - SEO requirements
   - Target audience alignment
   - Call-to-action effectiveness
   - Brand voice consistency
   - Mobile responsiveness

3. System Optimization:
   - Response time targets
   - Resource utilization
   - Scalability requirements
   - Maintenance considerations
   - Cost efficiency
   - Security standards`,
			},
		],
		resultTabs: ["evaluation", "improvements", "final"],
		phases: [
			"Initial Evaluation",
			"Improvement Generation",
			"Quality Assessment",
		],
		capabilities: [
			"Two-phase iteration: evaluation and improvement",
			"Quality scoring with zod schema (0-10)",
			"Detailed feedback generation",
			"Early stopping on quality threshold (≥9)",
			"Maximum 2 improvement cycles",
			"Per-iteration token tracking",
			"Progressive quality monitoring",
		],
		maxIterations: 2,
		averageTime: 95,
	},
	{
		name: "Multi-Step Tool Usage",
		id: "multi-step-tool-usage",
		description:
			"A sophisticated problem-solving agent that breaks down complex tasks into a series of well-defined steps. It leverages specialized tools and algorithms to tackle each step optimally, ensuring comprehensive and accurate solutions through methodical progression.",
		input: "Detailed problem description in natural language",
		output:
			"Comprehensive solution with step-by-step breakdown, tool usage analysis, and final results",
		parameter: "maxSteps (default: 5, range: 3-10)",
		context:
			"Perfect for complex scenarios requiring systematic breakdown and specialized tools",
		inputFields: [
			{
				name: "prompt",
				type: "textarea" as const,
				label: "Problem Description",
				placeholder: `Describe your problem in detail. The agent will solve it step by step using available tools.

Example problems:

1. Financial Planning:
   "Calculate the optimal investment strategy for $50,000 with a 10-year horizon, considering:
   - Monthly contributions of $500
   - Risk tolerance: moderate
   - Tax implications
   - Inflation adjustment
   - Portfolio rebalancing needs"

2. Travel Itinerary:
   "Plan a 2-week Europe trip covering Paris, Rome, and Barcelona with:
   - Budget: $5,000
   - Focus on historical sites and local cuisine
   - Public transportation preferred
   - Need hotel recommendations
   - Must include local events/festivals"

3. System Architecture:
   "Design a scalable e-commerce platform architecture with:
   - Expected 100k daily active users
   - Real-time inventory management
   - Payment processing integration
   - Multi-region deployment
   - Disaster recovery requirements"`,
			},
		],
		resultTabs: ["response", "steps", "tools"],
		tools: [
			{
				name: "calculate",
				description: "Mathematical expression evaluator",
			},
			{
				name: "planTrip",
				description: "Travel planning assistant",
			},
		],
		capabilities: [
			"Tool-based problem solving",
			"Step-by-step execution",
			"Mathematical calculations",
			"Travel itinerary planning",
			"Detailed step tracking",
			"Tool usage history",
			"Maximum 10 tool steps",
			"Structured output formatting",
		],
		steps: [
			"Problem Analysis",
			"Tool Selection",
			"Step Execution",
			"Result Integration",
		],
		averageTime: 20,
	},
] as const satisfies AgentType[];

export const examplePrompts = {
	"multi-step-tool-usage": [
		{
			prompt: `Calculate an optimal investment strategy for a retirement portfolio:
- Initial investment: $100,000
- Monthly contribution: $1,000
- Time horizon: 25 years
- Risk profile: Moderate
- Consider: Tax implications, inflation adjustment, rebalancing schedule
- Need: Detailed breakdown of asset allocation and expected returns`,
		},
		{
			prompt: `Plan a comprehensive 2-week Japan cultural experience:
- Budget: $8,000 for 2 people
- Must visit: Tokyo, Kyoto, Osaka
- Interests: Traditional arts, local cuisine, historical sites
- Requirements: 
  - Mix of guided tours and self-exploration
  - Local festival participation
  - Authentic cooking classes
  - Tea ceremony experience
  - Bullet train travel between cities
- Need: Day-by-day itinerary with accommodations and activities`,
		},
		{
			prompt: `Design a scalable microservices architecture for a social media platform:
- Expected scale: 1M daily active users
- Features required:
  - Real-time messaging and notifications
  - Media sharing and processing
  - User authentication with OAuth
  - Content recommendation engine
  - Analytics and reporting
- Technical requirements:
  - Kubernetes deployment
  - Event-driven architecture
  - Data replication strategy
  - Caching implementation
  - Security measures
- Need: Detailed architecture diagram and component breakdown`,
		},
	],
	"sequential-processing": [
		{
			content: `# Authentication in Distributed Systems

In modern distributed systems, authentication presents unique challenges due to:
- Multiple service interactions
- Various trust boundaries
- Different authentication mechanisms
- Stateless nature of communications

Common approaches include:
1. Token-based authentication (JWT)
2. OAuth 2.0 and OpenID Connect
3. API keys and secrets
4. Mutual TLS authentication`,
			instructions:
				"Transform into a comprehensive developer guide with code examples and best practices",
		},
		{
			content: `async function processUserData(users: User[]): Promise<ProcessedUser[]> {
  return users.map(user => ({
    ...user,
    fullName: user.firstName + ' ' + user.lastName,
    age: calculateAge(user.birthDate)
  }));
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}`,
			instructions:
				"Optimize for performance, add error handling, and implement batch processing",
		},
		{
			content: `Recent advances in quantum computing have demonstrated significant progress in error correction and qubit stability. The development of topological qubits shows promise in addressing the scalability challenges faced by current quantum computers. This breakthrough could accelerate the timeline for achieving quantum advantage in practical applications.`,
			instructions:
				"Analyze technical implications, evaluate credibility, and project future developments",
		},
	],
	routing: [
		{
			query: `Explain the potential impact of quantum computing on current cryptographic systems:
- Focus on RSA and elliptic curve cryptography
- Timeline for quantum threat readiness
- Post-quantum cryptography alternatives
- Implementation challenges
- Migration strategies for existing systems`,
		},
		{
			query: `Design a high-performance data pipeline for real-time financial data processing:
- Handle 100k transactions per second
- Requirements:
  - Sub-millisecond latency
  - Guaranteed message delivery
  - Data consistency checks
  - Automated failover
  - Audit logging
- Technology stack preferences:
  - Apache Kafka
  - Redis
  - PostgreSQL
  - Kubernetes`,
		},
		{
			query: `Create an engaging science fiction story about a civilization discovering a way to manipulate entropy:
Theme: The balance between progress and natural order
Elements to include:
- Quantum physics concepts
- Ethical dilemmas
- Time dilation effects
- Social implications
- Character development focusing on a quantum physicist and a philosopher
Style: Hard science fiction with philosophical undertones`,
		},
	],
	"orchestrator-worker": [
		{
			requirements: `Implement a real-time collaborative document editing system:
- Core Features:
  - Operational transformation for conflict resolution
  - Real-time cursor presence
  - Version history and restoration
  - Rich text formatting
  - Comment and suggestion system
- Technical Requirements:
  - WebSocket communication
  - Redis pub/sub system
  - Document diffing algorithm
  - Optimistic UI updates
  - Offline support`,
			constraints: `Technical Constraints:
- Maximum latency: 50ms
- 99.99% uptime requirement
- GDPR and SOC2 compliance
- Support 1000 concurrent document editors
Resource Constraints:
- Budget: $150k
- Timeline: 4 months
- Team: 5 developers, 1 designer
- AWS infrastructure
Business Constraints:
- Must integrate with existing auth system
- Beta testing with select customers
- Performance monitoring required
- Regular security audits`,
		},
		{
			requirements: `Build an AI-powered customer service automation platform:
- Features:
  - Natural language query understanding
  - Multi-language support
  - Sentiment analysis
  - Automated ticket routing
  - Knowledge base integration
  - Agent assistance suggestions
- Integration Requirements:
  - CRM system connection
  - Email and chat platforms
  - Analytics dashboard
  - Training interface
  - Performance monitoring`,
			constraints: `Technical Requirements:
- Response time < 2 seconds
- 24/7 availability
- Multi-region deployment
- Data encryption at rest and in transit
Resource Allocation:
- Budget: $300k
- Timeline: 6 months
- Team: ML engineers, backend developers
- Cloud-agnostic design
Compliance:
- GDPR, CCPA compliance
- Regular security audits
- Data retention policies`,
		},
		{
			requirements: `Develop a machine learning pipeline for predictive maintenance:
- System Components:
  - Sensor data collection
  - Real-time processing
  - Model training automation
  - Prediction service
  - Alert system
  - Visualization dashboard
- Technical Features:
  - Time-series analysis
  - Anomaly detection
  - Failure prediction
  - Maintenance scheduling
  - Cost optimization`,
			constraints: `Performance Requirements:
- Processing latency < 100ms
- 99.999% availability
- Model accuracy > 95%
- Handle 10k sensors
Resource Constraints:
- Budget: $250k
- Timeline: 5 months
- Infrastructure: GCP
- Team: 6 specialists
Integration Requirements:
- ERP system connection
- Mobile app alerts
- REST API access
- Monitoring integration`,
		},
	],
	"evaluator-optimizer": [
		{
			content: `WITH RankedCustomers AS (
  SELECT 
    c.customer_id,
    c.name,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_spent,
    ROW_NUMBER() OVER (PARTITION BY c.segment ORDER BY SUM(o.total_amount) DESC) as segment_rank
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  WHERE o.status = 'completed'
    AND o.order_date >= DATEADD(month, -12, GETDATE())
  GROUP BY c.customer_id, c.name, c.segment
)
SELECT * FROM RankedCustomers WHERE segment_rank <= 100`,
			criteria: `Query Optimization Goals:
- Improve execution time
- Reduce memory usage
- Optimize index usage
- Handle large datasets efficiently
- Maintain readability
Technical Requirements:
- Support concurrent access
- Consider partitioning strategy
- Implement proper indexing
- Optimize join operations
- Handle NULL values appropriately`,
		},
		{
			content: `export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sorting,
  filtering,
  pagination,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState(sorting);
  const [filterConfig, setFilterConfig] = useState(filtering);
  const [page, setPage] = useState(1);
  
  const processedData = useMemo(() => {
    let result = [...data];
    // Basic sorting
    if (sortConfig) {
      result.sort((a, b) => a[sortConfig.field] > b[sortConfig.field] ? 1 : -1);
    }
    // Basic filtering
    if (filterConfig) {
      result = result.filter(item => item[filterConfig.field].includes(filterConfig.value));
    }
    return result;
  }, [data, sortConfig, filterConfig]);

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.field}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedData.map((row, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={column.field}>{row[column.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
			criteria: `Component Optimization Requirements:
- Performance optimization
  - Virtualization for large datasets
  - Memoization strategy
  - Event handling optimization
  - Render optimization
- Feature enhancement
  - Advanced sorting (multi-column)
  - Complex filtering
  - Pagination controls
  - Column resizing
- Code quality
  - TypeScript type safety
  - Error boundaries
  - Loading states
  - Accessibility
- Style improvements
  - Responsive design
  - Custom theming
  - Animation support
  - Mobile optimization`,
		},
		{
			content: `Introducing TechFlow: The Ultimate Developer Productivity Suite

TechFlow helps developers write better code faster. Our platform includes:
- Smart code completion
- Automated testing
- Performance monitoring
- Team collaboration

Key Benefits:
- Increase productivity
- Reduce bugs
- Improve code quality
- Enhance team workflow

Perfect for development teams of all sizes. Try TechFlow today and transform your development process.`,
			criteria: `Marketing Copy Optimization Goals:
- Value Proposition
  - Clear unique selling points
  - Specific benefits quantification
  - Target audience resonance
  - Competitive differentiation
- Technical Accuracy
  - Feature description precision
  - Technical terminology
  - Implementation details
  - Integration capabilities
- Conversion Optimization
  - Call-to-action effectiveness
  - Social proof integration
  - Risk reduction elements
  - Trial/demo highlights
- SEO Requirements
  - Keyword optimization
  - Meta description
  - Header structure
  - Rich snippet potential`,
		},
	],
	"parallel-processing": [
		{
			content: `The integration of artificial intelligence in healthcare has revolutionized patient care through:
1. Diagnostic Assistance
   - Medical imaging analysis
   - Symptom pattern recognition
   - Risk factor assessment
2. Treatment Planning
   - Personalized medicine
   - Drug interaction analysis
   - Outcome prediction
3. Administrative Efficiency
   - Automated scheduling
   - Resource allocation
   - Documentation automation`,
			aspects:
				"clinical_impact,technical_feasibility,ethical_considerations,cost_benefit_analysis,implementation_challenges",
		},
		{
			content: `Modern cloud architecture patterns have evolved to address:
- Scalability challenges
  - Auto-scaling mechanisms
  - Load balancing strategies
  - Resource optimization
- Security requirements
  - Zero-trust architecture
  - Identity management
  - Encryption standards
- Reliability concerns
  - Fault tolerance
  - Disaster recovery
  - High availability`,
			aspects:
				"architectural_patterns,security_implications,performance_metrics,cost_optimization,operational_efficiency",
		},
		{
			content: `The future of sustainable transportation relies on:
1. Electric Vehicle Technology
   - Battery innovations
   - Charging infrastructure
   - Grid integration
2. Smart City Integration
   - Traffic optimization
   - Public transport coordination
   - Environmental monitoring
3. Policy Framework
   - Emissions regulations
   - Infrastructure funding
   - Industry incentives`,
			aspects:
				"technological_readiness,environmental_impact,economic_viability,social_acceptance,policy_implications",
		},
	],
};
