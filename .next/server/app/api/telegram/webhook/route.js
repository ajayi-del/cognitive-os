"use strict";(()=>{var e={};e.id=9009,e.ids=[9009],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9420:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>m,originalPathname:()=>g,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>d,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>p});var n={};a.r(n),a.d(n,{GET:()=>GET,POST:()=>POST});var o=a(884),r=a(6132),s=a(5798);let i=process.env.TELEGRAM_BOT_TOKEN||"";async function POST(e){try{let t=await e.json();return console.log("\uD83D\uDCE8 Received Telegram update:",t),t.message&&await handleTelegramMessage(t.message),t.callback_query&&await handleCallbackQuery(t.callback_query),s.Z.json({ok:!0})}catch(e){return console.error("Telegram webhook error:",e),s.Z.json({error:"Webhook processing failed"},{status:500})}}async function handleTelegramMessage(e){let t=e.chat.id,a=e.text||"",n=e.from.id;console.log(`💬 Message from ${n}: ${a}`);let o=parseMessageIntent(a),r=await generateAutonomousResponse(o,e);await sendTelegramMessage(t,r)}function parseMessageIntent(e){let t=e.toLowerCase();return t.startsWith("/")?{type:"command",command:t.substring(1),original_text:e}:t.includes("?")||t.includes("how")||t.includes("what")?{type:"question",topic:extractTopic(t),original_text:e}:t.includes("apply")||t.includes("job")||t.includes("career")?{type:"career_task",action:"job_search",original_text:e}:t.includes("schedule")||t.includes("meeting")||t.includes("call")?{type:"scheduling",action:"create_event",original_text:e}:{type:"general",topic:extractTopic(t),original_text:e}}async function generateAutonomousResponse(e,t){switch(e.type){case"command":return await handleCommand(e.command,t);case"question":return await handleQuestion(e.topic,t);case"career_task":return await handleCareerTask(e.action,t);case"scheduling":return await handleSchedulingTask(e.action,t);default:return await handleGeneralQuery(e.topic,t)}}async function handleCommand(e,t){switch(t.chat.id,e){case"start":return`🤖 *Cognitive OS Autonomous Agent*

I'm your AI companion that can:
📝 Apply to jobs automatically
💬 Handle communications
📅 Manage your schedule
🧠 Learn and improve
✍️ Create content

Commands:
/status - Check system status
/career - Job search mode
/schedule - Scheduling mode
/learn - Learning mode
/permissions - Check permissions

*Ready to assist!*`;case"status":let a=await getSystemStatus();return`📊 *System Status*
🔋 Energy: ${a.energy}%
🧠 Learning: ${a.learning_active?"Active":"Idle"}
📬 Messages: ${a.messages_processed}
📅 Events: ${a.events_created}
📝 Applications: ${a.applications_submitted}`;case"career":return`📝 *Career Mode*
I can help you:
• Find relevant jobs
• Customize applications
• Submit applications
• Track responses

Send me job criteria or say "find jobs [position] [location]"`;case"schedule":return`📅 *Scheduling Mode*
I can:
• Analyze your patterns
• Optimize your schedule
• Create events
• Set reminders

Send me "schedule [event] [time]" or "show my week"`;case"learn":return`🧠 *Learning Mode*
I'm constantly learning from:
• Our interactions
• System performance
• Your preferences
• External data

Current learning score: ${await getLearningScore()}/100`;case"permissions":let n=await getUserPermissions();return`🔐 *Current Permissions*
✅ Auto-apply: ${n.auto_job_apply?"Enabled":"Disabled"}
✅ Auto-communicate: ${n.auto_communication?"Enabled":"Disabled"}
✅ Auto-schedule: ${n.auto_scheduling?"Enabled":"Disabled"}
🔒 Max autonomy: Level ${n.max_autonomy_level}/10`;default:return`❓ Unknown command. Type /start for available commands.`}}async function handleQuestion(e,t){try{let a=await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t.text,source:"telegram",user_context:{platform:"telegram",user_id:t.from.id,chat_type:t.chat.type}})});if(!a.ok)return`🤔 I'm thinking about "${e}"... Let me get back to you on that.`;{let e=await a.json();return e.response}}catch(e){return console.error("Question handling error:",e),`❌ I had trouble processing that question. Please try again.`}}async function handleCareerTask(e,t){return"job_search"===e?`🔍 *Job Search Activated*

I'm searching for positions that match your profile and preferences...

Criteria I'm using:
• Your career objectives
• Recent skill development
• Market demand
• Salary expectations

I'll notify you when I find matches. This may take a few minutes.

💡 *Tip:* You can also say "find jobs [keywords] [location]" for specific searches.`:`📝 I'll help with your career tasks. What specifically would you like me to do?`}async function handleSchedulingTask(e,t){return"create_event"===e?`📅 *Scheduling Assistant*

I can create events for you. Please provide:
• Event title
• Date and time
• Duration
• Priority level

Example: "schedule team meeting tomorrow 2pm 1hour high"`:`📅 I'm ready to help with scheduling. What event would you like me to create?`}async function handleGeneralQuery(e,t){return`💭 I understand you're asking about "${e}". 

I'm processing this through my autonomous systems and will get back to you with a comprehensive response.

*Current capabilities:*
🤖 AI reasoning
📊 Pattern analysis
🔍 Information retrieval
📝 Action execution

*Processing...* ⏳`}async function sendTelegramMessage(e,t){if(!i){console.error("Telegram bot token not configured");return}try{let a=await fetch(`https://api.telegram.org/bot${i}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:e,text:t,parse_mode:"Markdown",disable_web_page_preview:!1})});if(!a.ok)throw Error("Failed to send Telegram message");console.log(`✅ Telegram message sent to ${e}`)}catch(e){console.error("Telegram send error:",e)}}async function handleCallbackQuery(e){let t=e.message.chat.id,a=e.data;console.log(`🔘 Callback query: ${a}`);let n="";switch(a){case"enable_auto_apply":n="✅ Auto job applications enabled";break;case"disable_auto_apply":n="❌ Auto job applications disabled";break;case"check_applications":n="\uD83D\uDCCA Checking your application status...";break;default:n="❓ Unknown action"}await sendTelegramMessage(t,n)}function extractTopic(e){let t=e.split(" ").filter(e=>e.length>3);return t[0]||"general"}async function getSystemStatus(){return{energy:75,learning_active:!0,messages_processed:42,events_created:8,applications_submitted:3}}async function getUserPermissions(){return{auto_job_apply:!0,auto_communication:!0,auto_scheduling:!0,max_autonomy_level:7}}async function getLearningScore(){return 85}async function GET(e){if(!i)return s.Z.json({error:"Telegram bot token not configured"},{status:500});let t="http://localhost:3000/api/telegram/webhook";try{let e=await fetch(`https://api.telegram.org/bot${i}/setWebhook`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:t,allowed_updates:["message","callback_query"]})});if(e.ok)return s.Z.json({success:!0,webhook_url:t,message:"Telegram webhook configured successfully"});throw Error("Failed to set webhook")}catch(e){return s.Z.json({error:"Webhook setup failed"},{status:500})}}process.env.TELEGRAM_WEBHOOK_URL;let c=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/telegram/webhook/route",pathname:"/api/telegram/webhook",filename:"route",bundlePath:"app/api/telegram/webhook/route"},resolvedPagePath:"/Users/dayodapper/CascadeProjects/cognitive-os/app/api/telegram/webhook/route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:l,staticGenerationAsyncStorage:u,serverHooks:d,headerHooks:m,staticGenerationBailout:p}=c,g="/api/telegram/webhook/route"}};var t=require("../../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[1997],()=>__webpack_exec__(9420));module.exports=a})();