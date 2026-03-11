# Stability Checklist - Cognitive OS

## Pre-Deployment Verification

### Critical Paths (Must Test)
- [ ] **Capture Flow**
  - [ ] Text capture → appears in queue
  - [ ] Voice recording → saves and plays back
  - [ ] Image drop → shows preview
  - [ ] All captures persist after refresh

- [ ] **Routing Flow**
  - [ ] Click "Project" → status changes to "routed"
  - [ ] Click "Action" → creates action item
  - [ ] Energy increases by 15 after routing

- [ ] **Focus Flow**
  - [ ] Start focus session on action
  - [ ] Timer runs and completes
  - [ ] Session result updates stats

- [ ] **Persistence**
  - [ ] Captures survive page refresh
  - [ ] Curiosity map survives refresh
  - [ ] Goals survive refresh

### UI Components
- [ ] All navigation links work
- [ ] Gamification panel shows streaks/XP
- [ ] Curiosity heatmap updates on capture
- [ ] System vitals show correct counts
- [ ] Biological badges render (ATP, lifecycle, resilience)

### Error Scenarios
- [ ] Empty capture (no crash)
- [ ] Microphone denied (graceful message)
- [ ] No localStorage (graceful fallback)

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```
- Free tier: 100GB bandwidth
- Auto-deploys from Git
- Serverless functions ready

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```
- Free tier: 100GB bandwidth
- Drag & drop deployment
- Form handling built-in

### Option 3: Local Only
```bash
npm run build
npm start
```
- Runs on localhost:3000
- No server needed
- Data stays in browser

## Environment Variables Needed
```
# AI Providers (pick one)
AI_PROVIDER=openai|deepseek|kimik2|ollama
OPENAI_API_KEY=your_key
DEEPSEEK_API_KEY=your_key

# Database (optional - can use localStorage only)
DATABASE_URL=postgresql://...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Monitoring for 1-Week Test

### Daily Checks
1. Open app - does it load?
2. Add 3 captures - do they appear?
3. Route 1 capture to Action - does energy increase?
4. Check Curiosity Heatmap - is your topic there?
5. Refresh page - did data survive?

### Weekly Review
- How many captures?
- What's your highest curiosity signal?
- Which lifecycle stage has most ideas?
- Did you create any projects from emergence?

## Known Limitations (For Now)
1. Audio recordings don't persist (blob URLs expire)
2. Image previews don't persist across sessions
3. No real database (localStorage only)
4. No user accounts (single user)
5. No sync between devices

## Next Phase (After 1 Week)
1. Add real database (PostgreSQL + Drizzle)
2. Add user authentication
3. Add device sync
4. Add AI transcription for voice notes
5. Add mobile app (React Native)
