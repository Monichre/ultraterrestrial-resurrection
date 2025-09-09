# Suggested Development Commands

## Main Application (Next.js) - apps/app/

### Development Server
```bash
cd apps/app
bun run dev              # Start development server (localhost:3000)
bun run build            # Production build
bun run start            # Start production server
```

### Code Quality
```bash
bun run lint             # Run ESLint
bun run storybook        # Component development (localhost:6006)
```

### Component Generation
```bash
bun run new              # Generate new component with Plop
bun run bun:new          # Alternative Bun-based generator
```

### Testing & Analysis
```bash
bun run audit:components # Component audit report
```

## RAG System (Python) - apps/disclosure-rag/

### Environment Setup
```bash
cd apps/disclosure-rag
python -m venv .venv && source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### Run Applications
```bash
python streamlit_app.py    # Interactive dashboard
python api_server.py       # FastAPI server
python cli.py             # Interactive CLI
```

### Data Processing
```bash
python process_entities.py  # Entity extraction
python main.py              # Main processing pipeline
```

## Database Operations - packages/db/

### Xata Operations
```bash
cd packages/db
bun run seed            # Seed database
bun run query           # Quick database query
bun run analyze         # Database state analysis
```

### Data Import/Export
```bash
cd apps/app
bun run export:xata     # Export Xata data
bun run import:data     # Import data
bun run import:events   # Import events specifically
```

## System Commands (Darwin/macOS)

### Git Operations
```bash
git status && git branch  # Check status and current branch
git add . && git commit -m "message"  # Stage and commit
git push origin [branch-name]        # Push to remote
```

### File Operations
```bash
ls -la                    # List files with details
find . -name "*.tsx"      # Find TypeScript React files
grep -r "searchterm" .    # Search text in files
cd [directory]            # Change directory
```

### Package Management
```bash
bun install              # Install dependencies (preferred)
npm install              # Alternative package manager
```

## Development Workflow Commands

### Start Development Session
```bash
# 1. Check git status
git status && git branch

# 2. Start main app
cd apps/app && bun run dev

# 3. Start RAG system (separate terminal)
cd apps/disclosure-rag && source .venv/bin/activate && python streamlit_app.py

# 4. Start Storybook (optional)
cd apps/app && bun run storybook
```

### Complete Task Workflow
```bash
# 1. Run linting
cd apps/app && bun run lint

# 2. Build application
bun run build

# 3. Run component audit
bun run audit:components

# 4. Git commit
git add . && git commit -m "descriptive message"
```