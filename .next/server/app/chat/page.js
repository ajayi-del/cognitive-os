(()=>{var e={};e.id=929,e.ids=[929],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},7310:e=>{"use strict";e.exports=require("url")},194:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>a.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>d,routeModule:()=>h,tree:()=>l});var n=s(7096),i=s(6132),r=s(7284),a=s.n(r),o=s(2564),c={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(c[e]=()=>o[e]);s.d(t,c);let l=["",{children:["chat",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,431)),"/Users/dayodapper/CascadeProjects/cognitive-os/app/chat/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,8690)),"/Users/dayodapper/CascadeProjects/cognitive-os/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,9291,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/dayodapper/CascadeProjects/cognitive-os/app/chat/page.tsx"],u="/chat/page",m={require:s,loadChunk:()=>Promise.resolve()},h=new n.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/chat/page",pathname:"/chat",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},7979:(e,t,s)=>{Promise.resolve().then(s.bind(s,7643))},7643:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>ChatInterface});var n=s(784),i=s(9885),r=s(8310),a=s(1814),o=s(2032),c=s(1057),l=s(8089);function ChatInterface(){let[e,t]=(0,i.useState)([]),[s,d]=(0,i.useState)(""),[u,m]=(0,i.useState)("all"),[h,g]=(0,i.useState)(!1),[p,x]=(0,i.useState)({}),v=(0,i.useRef)(null),scrollToBottom=()=>{v.current?.scrollIntoView({behavior:"smooth"})};(0,i.useEffect)(()=>{scrollToBottom()},[e]),(0,i.useEffect)(()=>{t([{id:"1",role:"assistant",content:`🧠 Welcome to Cognitive OS Chat!

I'm your personal thinking assistant with access to your notes, projects, and patterns. I can help you:

• **Pattern Recognition** - Detect recurring themes in your thinking
• **Project Clarity** - Convert scattered ideas into structured projects  
• **Strategic Direction** - Provide daily briefings and priority ranking
• **Execution Support** - Generate actionable tasks and next steps
• **Knowledge Synthesis** - Connect ideas across different domains

Try asking me:
• "What patterns have I been thinking about lately?"
• "Help me organize my trading system ideas"
• "What should I focus on this week?"
• "Convert this idea into a project"

I remember everything we discuss and learn from your feedback over time.`,contextScope:"all",referencedNoteIds:[],createdAt:new Date}])},[]);let handleSendMessage=async()=>{if(!s.trim())return;let e={id:Date.now().toString(),role:"user",content:s,contextScope:u,referencedNoteIds:[],createdAt:new Date};t(t=>[...t,e]),d(""),g(!0),setTimeout(()=>{let e=generateAIResponse(s,u),n={id:(Date.now()+1).toString(),role:"assistant",content:e,contextScope:u,referencedNoteIds:[],createdAt:new Date};t(e=>[...e,n]),g(!1)},1500)},generateAIResponse=(e,t)=>{let s=e.toLowerCase();return s.includes("pattern")||s.includes("recurring")?`🔍 **Pattern Analysis**

Based on your recent thinking patterns, I've identified several recurring themes:

**High-Frequency Patterns:**
• Trading system architecture (8 mentions this month)
• Cognitive workflow optimization (6 mentions)  
• Market pattern recognition (5 mentions)

**Emerging Patterns:**
• Personal productivity systems (growing frequency)
• AI-human collaboration models (new but consistent)

**Strategic Insight:**
Your trading system ideas have evolved from scattered concepts to a coherent architecture. This suggests it's ready to become a concrete project rather than remaining as idea fragments.

**Recommendation:**
Consider dedicating focused time to the trading system - it has the most momentum and clearest execution path.`:s.includes("trading")||s.includes("market")?`📊 **Trading Analysis**

I've analyzed your recent trading-related thoughts and found consistent patterns:

**Core Thesis Evolution:**
Your thinking has moved from discretionary ideas to systematic approaches. I see 3 related concepts that could be unified:

1. **Volatility-Based Entry System** - Pattern recognition in compression phases
2. **Risk Management Framework** - Position sizing and invalidation logic  
3. **Multi-Timeframe Analysis** - Connecting short-term setups to longer-term trends

**Structured Next Steps:**
• Define entry criteria with specific volatility thresholds
• Document invalidation scenarios for each setup type
• Create backtesting framework for validation

**Missing Elements:**
• Specific asset classes to focus on
• Time commitment allocation
• Success metrics definition

Would you like me to help you create a project structure for this trading system?`:s.includes("project")||s.includes("organize")?`🎯 **Project Organization**

I can help you structure your scattered ideas into actionable projects. Based on your recent notes, I see these project candidates:

**Ready for Projects:**
1. **Cognitive OS Development** - Clear requirements, existing momentum
2. **Trading System Architecture** - Detailed thinking, systematic approach
3. **Personal Knowledge Management** - Recurring themes, clear value

**Still as Idea Buckets:**
• German learning methods
• Career path optimization
• Research workflow systems

**Project Conversion Criteria:**
• Appears consistently over time ✓
• Has actionable components ✓  
• Clear success metrics ✓
• Resource requirements defined ⚠️

**Next Actions:**
1. Choose which project to prioritize this month
2. Define success criteria for each
3. Estimate resource requirements
4. Create implementation timeline

Which project resonates most with your current focus?`:s.includes("focus")||s.includes("priority")||s.includes("week")?`🎯 **Strategic Focus Analysis**

Based on your recent thinking patterns and current project states:

**This Week's Strategic Direction:**
"Complete the trading system architecture specification while maintaining daily cognitive capture."

**Top 3 Priorities:**
1. **Trading System Design** - Highest momentum, clear execution path
2. **Cognitive OS Chat Enhancement** - Improves all other work
3. **Pattern Documentation** - Supports systematic thinking

**What to Ignore:**
• New project ideas (capture but don't act)
• German learning (lower urgency)
• Career planning (not time-sensitive)

**Execution Strategy:**
• Morning: Deep work on trading system (2-3 hours)
• Afternoon: Cognitive system improvements (1-2 hours)  
• Evening: Pattern capture and reflection (30 minutes)

**Success Metrics:**
• Trading system spec completed
• 3+ high-quality notes captured daily
• One pattern insight documented

This balances focused execution with continuous cognitive improvement.`:`🧠 **Cognitive Analysis**

I understand you're thinking about: "${e}"

**Context Analysis:**
• Current scope: ${t}
• Related patterns in your recent notes
• Connection to your active projects

**Key Insights:**
This touches on themes you've explored before. I see connections to your systems thinking approach and desire for structured execution.

**Strategic Questions:**
• Is this a new direction or evolution of existing thinking?
• What would make this actionable rather than just conceptual?
• How does this align with your current priorities?

**Next Steps:**
Would you like me to:
• Help organize this into a project structure?
• Connect this to related ideas you've had?
• Generate specific action items?
• Analyze patterns in this type of thinking?

I'm learning from your feedback to better align with your cognitive style and priorities.`},handleFeedback=(e,t)=>{x(s=>({...s,[e]:t})),console.log(`Feedback ${t} for message ${e}`)},handleSaveToNotes=e=>{console.log("Saving to notes:",e)},handleCreateTask=e=>{console.log("Creating task from:",e)};return(0,n.jsxs)("div",{className:"min-h-screen cognitive-bg",children:[n.jsx("div",{className:"cognitive-elevated border-b border-cognitive-border",children:n.jsx("div",{className:"max-w-4xl mx-auto px-4 py-4",children:(0,n.jsxs)("div",{className:"flex items-center justify-between",children:[(0,n.jsxs)("div",{className:"flex items-center space-x-3",children:[n.jsx(r.Z,{className:"w-6 h-6 cognitive-accent"}),(0,n.jsxs)("div",{children:[n.jsx("h1",{className:"text-lg font-semibold text-white",children:"Chat Interface"}),n.jsx("p",{className:"text-xs cognitive-text-muted",children:"Context-aware AI assistant"})]})]}),(0,n.jsxs)("div",{className:"flex items-center space-x-2",children:[n.jsx("span",{className:"text-sm cognitive-text-muted",children:"Scope:"}),(0,n.jsxs)("select",{value:u,onChange:e=>m(e.target.value),className:"bg-cognitive-surface border border-cognitive-border rounded px-3 py-1 text-sm text-white",children:[n.jsx("option",{value:"all",children:"All Memory"}),n.jsx("option",{value:"notes",children:"Notes Only"}),n.jsx("option",{value:"project",children:"Selected Project"}),n.jsx("option",{value:"trading",children:"Trading"}),n.jsx("option",{value:"coding",children:"Coding"})]})]})]})})}),(0,n.jsxs)("div",{className:"max-w-4xl mx-auto px-4 py-6",children:[n.jsx("div",{className:"cognitive-surface border border-cognitive-border rounded-lg",children:(0,n.jsxs)("div",{className:"h-[600px] overflow-y-auto p-6 space-y-4",children:[e.map(e=>(0,n.jsxs)("div",{className:`flex items-start space-x-3 ${"user"===e.role?"justify-end":"justify-start"}`,children:["assistant"===e.role&&n.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-accent flex items-center justify-center",children:n.jsx(a.Z,{className:"w-4 h-4 text-white"})}),(0,n.jsxs)("div",{className:`max-w-2xl ${"user"===e.role?"bg-cognitive-accent/20 border border-cognitive-accent/50":"cognitive-surface border border-cognitive-border"} rounded-lg p-4`,children:[n.jsx("div",{className:"text-white whitespace-pre-wrap",children:e.content}),"assistant"===e.role&&(0,n.jsxs)("div",{className:"flex items-center justify-between mt-3 pt-3 border-t border-cognitive-border",children:[(0,n.jsxs)("div",{className:"flex items-center space-x-2",children:[n.jsx("button",{onClick:()=>handleSaveToNotes(e.content),className:"text-xs cognitive-text-muted hover:text-cognitive-accent transition-colors",children:"Save to Notes"}),n.jsx("button",{onClick:()=>handleCreateTask(e.content),className:"text-xs cognitive-text-muted hover:text-cognitive-accent transition-colors",children:"Create Task"})]}),(0,n.jsxs)("div",{className:"flex items-center space-x-1",children:[n.jsx("button",{onClick:()=>handleFeedback(e.id,"up"),className:`p-1 rounded transition-colors ${"up"===p[e.id]?"text-cognitive-success":"text-cognitive-text-muted hover:text-cognitive-success"}`,children:n.jsx(o.Z,{className:"w-4 h-4"})}),n.jsx("button",{onClick:()=>handleFeedback(e.id,"down"),className:`p-1 rounded transition-colors ${"down"===p[e.id]?"text-cognitive-danger":"text-cognitive-text-muted hover:text-cognitive-danger"}`,children:n.jsx(c.Z,{className:"w-4 h-4"})})]})]})]}),"user"===e.role&&n.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-text-muted flex items-center justify-center",children:n.jsx("span",{className:"text-sm font-medium text-white",children:"You"})})]},e.id)),h&&(0,n.jsxs)("div",{className:"flex items-center space-x-3",children:[n.jsx("div",{className:"flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-accent flex items-center justify-center",children:n.jsx(a.Z,{className:"w-4 h-4 text-white animate-pulse"})}),n.jsx("div",{className:"cognitive-surface border border-cognitive-border rounded-lg p-4",children:(0,n.jsxs)("div",{className:"flex items-center space-x-2",children:[n.jsx("div",{className:"w-2 h-2 bg-cognitive-accent rounded-full animate-bounce",style:{animationDelay:"0ms"}}),n.jsx("div",{className:"w-2 h-2 bg-cognitive-accent rounded-full animate-bounce",style:{animationDelay:"150ms"}}),n.jsx("div",{className:"w-2 h-2 bg-cognitive-accent rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})]}),n.jsx("div",{ref:v})]})}),(0,n.jsxs)("div",{className:"mt-6 cognitive-surface border border-cognitive-border rounded-lg p-4",children:[(0,n.jsxs)("div",{className:"flex items-end space-x-3",children:[n.jsx("div",{className:"flex-1",children:n.jsx("textarea",{value:s,onChange:e=>d(e.target.value),onKeyPress:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),handleSendMessage())},placeholder:"Ask me anything about your notes, projects, patterns, or strategic direction...",className:"w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-3 text-white placeholder-cognitive-text-muted resize-none focus:outline-none focus:border-cognitive-accent transition-colors",rows:3})}),(0,n.jsxs)("button",{onClick:handleSendMessage,disabled:!s.trim()||h,className:"px-4 py-3 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2",children:[n.jsx(l.Z,{className:"w-4 h-4"}),n.jsx("span",{children:"Send"})]})]}),(0,n.jsxs)("div",{className:"mt-3 flex items-center space-x-2 text-sm",children:[n.jsx("span",{className:"cognitive-text-muted",children:"Quick prompts:"}),n.jsx("button",{onClick:()=>d("What patterns have I been thinking about lately?"),className:"cognitive-accent hover:underline",children:"Pattern Analysis"}),n.jsx("button",{onClick:()=>d("Help me organize my trading system ideas"),className:"cognitive-accent hover:underline",children:"Trading Ideas"}),n.jsx("button",{onClick:()=>d("What should I focus on this week?"),className:"cognitive-accent hover:underline",children:"Weekly Focus"})]})]})]})]})}},431:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>a,__esModule:()=>r,default:()=>c});var n=s(5153);let i=(0,n.createProxy)(String.raw`/Users/dayodapper/CascadeProjects/cognitive-os/app/chat/page.tsx`),{__esModule:r,$$typeof:a}=i,o=i.default,c=o}};var t=require("../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),s=t.X(0,[704,105,945],()=>__webpack_exec__(194));module.exports=s})();