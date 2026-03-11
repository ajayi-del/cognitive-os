# 🧠 Cognitive OS - Personal AI Operating System

**Transform scattered thoughts into structured action and strategic direction**

A personal cognitive operating system designed for deep-thinking systems-oriented users who want to turn raw ideas into structured projects, detect patterns in their thinking, and execute with clarity.

---

## 🎯 **Core Philosophy**

This is not a generic AI assistant. This is a **personal thinking partner** that:

- **Remembers** everything you capture
- **Detects patterns** in your recurring thoughts  
- **Organizes** scattered ideas into coherent projects
- **Generates** strategic direction from your cognitive patterns
- **Trains** itself to align with your thinking style
- **Executes** tasks with bounded autonomy

---

## 🚀 **Quick Start**

### **1. Installation**
```bash
# Clone the repository
git clone https://github.com/your-username/cognitive-os.git
cd cognitive-os

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database and API keys

# Setup database
npm run db:migrate

# Seed demo data
npm run db:seed
```

### **2. Development**
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 🧩 **System Architecture**

### **Cognitive Layers**
```
🧠 INPUT LAYER
├── Chat Interface
├── Notes Capture
├── Voice Processing
└── File Upload

🧠 INGESTION LAYER  
├── Content Parsing
├── Transcription
├── Cleaning & Tagging
└── Embedding Storage

🧠 MEMORY LAYER
├── Raw Notes
├── Chat History
├── Voice Transcripts
└── Project Links

🧠 PATTERN ENGINE
├── Semantic Clustering
├── Recurring Theme Detection
├── Frequency Analysis
└── Project Promotion Logic

🧠 PROJECT ENGINE
├── Project State Management
├── Task Generation
├── Execution Tracking
└── Blocker Resolution

🧠 AGENT LAYER
├── Strategist Agent
├── Analyst Agent  
├── Builder Agent
├── Executor Agent
├── Trade Analyst Agent
└── Coding Execution Agent

🧠 WORKFLOW ENGINE
├── Input Classification
├── Autonomous Routing
├── Approval Gates
└── Execution Logging
```

---

## 📱 **Core Features**

### **🗣️ Chat Interface**
- **Context-Aware**: AI sees your notes, projects, and patterns
- **Memory Scoping**: Chat with all memory, specific projects, or content types
- **Action Integration**: Save responses to notes, create tasks, link projects
- **Feedback Loop**: Thumbs up/down to train AI responses

### **📝 Notes Workspace**
- **Quick Capture**: Instant thought recording with tags
- **Living Storage**: Notes are not dead storage - they're active cognitive material
- **AI Analysis**: Ask AI about any note for deeper insights
- **Project Linking**: Convert notes to projects with one click
- **Similarity Detection**: Find related thoughts automatically

### **🪣 Idea Buckets**
- **Automatic Clustering**: Groups similar thoughts into coherent themes
- **Frequency Tracking**: See which ideas keep recurring
- **Confidence Scoring**: AI assesses which buckets are real project candidates
- **Promotion Logic**: Buckets become projects when they show actionable structure

### **🎯 Projects**
- **Operational Management**: Convert ideas into structured projects
- **Multi-Domain Support**: Coding, trading, research, personal projects
- **Execution Modes**: Manual, assisted, or semi-autonomous workflows
- **Progress Tracking**: Monitor project momentum and blockers

### **📋 Daily Briefing**
- **Strategic Direction**: AI analyzes your patterns to provide daily focus
- **Priority Ranking**: What matters now vs. what to ignore
- **Pattern Insights**: What themes are emerging in your thinking
- **Action Planning**: Concrete next steps based on your cognitive state

### **🔄 Workflow Engine**
- **Smart Routing**: Classify inputs and route to appropriate workflows
- **Bounded Autonomy**: 4 levels from manual to semi-autonomous execution
- **Approval Gates**: Human oversight for important decisions
- **Execution Logging**: Every autonomous action is explainable

---

## 🤖 **AI Agents**

### **Strategist Agent**
- Generates daily and weekly strategic direction
- Ranks projects by importance and urgency
- Identifies signal vs. noise in your thinking
- Provides high-level strategic guidance

### **Analyst Agent**
- Summarizes and synthesizes complex information
- Extracts key insights from scattered thoughts
- Compares thinking patterns across time
- Compresses knowledge into actionable insights

### **Builder Agent**
- Converts ideas into structured specifications
- Generates implementation plans and roadmaps
- Creates task breakdowns for projects
- Designs system architectures

### **Executor Agent**
- Generates sequenced action items
- Suggests the next best task
- Prevents overwhelm with intelligent task sequencing
- Tracks incomplete work and follow-through

### **Trade Analyst Agent**
- Structures trading thoughts into actionable analysis
- Groups related market ideas
- Extracts setup logic, invalidation, and risk management
- Generates scenario-based trade plans

### **Coding Execution Agent**
- Converts project specs into implementation plans
- Generates file structures and coding tasks
- Maintains project progress tracking
- Produces concrete development artifacts

---

## 🎨 **Design Principles**

### **Dark, Intelligent, Calm**
- **Minimal UI**: Only essential elements visible
- **High Signal**: Every component serves cognitive purpose
- **Cognitive Load**: Prevents overwhelm with smart defaults
- **Context Awareness**: UI adapts to user's current focus

### **Systems-Oriented**
- **Pattern Recognition**: Helps user see hidden connections
- **Structural Thinking**: Organizes chaos into coherent systems
- **Execution Focus**: Converts insight to action
- **Continuous Learning**: System improves with user feedback

---

## 🔧 **Technical Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling with custom cognitive theme
- **Lucide React** - Clean, modern icon library
- **Zustand** - Lightweight state management

### **Backend**
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database with vector support
- **OpenAI API** - Advanced language model integration
- **Node.js** - Server runtime

### **Infrastructure**
- **Vector Embeddings** - Semantic search and similarity detection
- **Background Jobs** - Async workflow processing
- **Real-time Updates** - WebSocket for live collaboration
- **Modular Architecture** - Clean separation of concerns

---

## 📊 **Database Schema**

### **Core Entities**
- **Users** - Personal preferences and settings
- **Notes** - Raw thoughts with embeddings and metadata
- **ChatMessages** - Conversational history with context
- **IdeaBuckets** - Clustered thought patterns
- **Projects** - Operational project management
- **Tasks** - Actionable execution items
- **FeedbackEvents** - AI training and improvement data
- **DailyBriefings** - Strategic direction records
- **WorkflowRuns** - Autonomous execution logs

### **Relationships**
- Notes → Projects (many-to-many)
- Notes → IdeaBuckets (many-to-one)
- Projects → Tasks (one-to-many)
- Users → All entities (one-to-many)

---

## 🔄 **Autonomy Levels**

### **Level 0 - Manual**
- AI suggests only
- User approves everything
- Full human control

### **Level 1 - Assisted**  
- Auto-organizes notes and creates buckets
- User approves project creation and actions
- Safe autonomous operations

### **Level 2 - Semi-Autonomous**
- Auto-clusters thoughts and updates projects
- Auto-generates action lists and task breakdowns
- User approval for important actions only

### **Level 3 - Workflow Autonomy**
- Executes safe deterministic workflows automatically
- Daily briefings, pattern detection, task generation
- Human approval for risky operations only

---

## 🎯 **MVP Features**

### **✅ Core (v1.0)**
- Chat interface with memory context
- Notes capture and organization
- Basic pattern detection and idea buckets
- Project creation and management
- Daily briefing generation
- Feedback loop for AI improvement

### **🔄 Advanced (v2.0)**
- Voice note transcription
- Advanced semantic clustering
- Semi-autonomous workflows
- External integrations (trading data, code execution)
- Multi-modal input (screenshots, files)

### **🚀 Full Vision (v3.0)**
- Complete autonomous workflows
- Advanced AI training system
- External API integrations
- Multi-user collaboration
- Advanced analytics and insights

---

## 🛠️ **Development**

### **Build Order**
1. **Foundation** - Database, schema, basic UI
2. **Core Features** - Notes, chat, basic clustering
3. **Intelligence** - AI agents, pattern detection
4. **Workflows** - Autonomous execution engine
5. **Polish** - Advanced UI, performance, testing

### **Running Locally**
```bash
# Development
npm run dev

# Database operations
npm run db:migrate
npm run db:seed

# Building
npm run build
npm run start
```

### **Environment Variables**
```bash
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📈 **Success Metrics**

### **User Engagement**
- Daily active use (5+ days/week)
- Note capture rate (10+ notes/week)
- Pattern recognition (3+ patterns identified)
- Project conversion (2+ buckets → projects)

### **AI Quality**
- Response relevance (80%+ thumbs up)
- Pattern accuracy (70%+ accurate clustering)
- Strategic value (60%+ briefing suggestions followed)

### **System Performance**
- Response time (<2 seconds)
- Search accuracy (90%+ relevant results)
- Workflow success (95%+ completion rate)

---

## 🤝 **Contributing**

This system is designed for systems thinkers who want to improve both their own thinking and their AI assistant over time.

### **Development Philosophy**
- **Structure over chaos** - Every feature serves cognitive purpose
- **Signal over noise** - Prioritize high-value interactions
- **Execution over talk** - Convert insights to action
- **Learning over static** - System improves with use

### **Areas for Contribution**
- **AI Agent Development** - New specialized agents for different domains
- **Pattern Recognition** - Advanced clustering and detection algorithms
- **Workflow Engine** - New autonomous workflows and approval gates
- **UI/UX** - Better cognitive interfaces and interactions
- **Integration** - External services and APIs

---

## 📄 **License**

MIT License - Feel free to use, modify, and distribute.

---

## 🎉 **Get Started**

```bash
git clone https://github.com/your-username/cognitive-os.git
cd cognitive-os
npm install
npm run dev
```

**Open http://localhost:3000 and start transforming your scattered thoughts into structured action!**

---

*Built for deep thinkers who want their AI to be a true cognitive partner rather than just another chatbot.* 🧠✨
