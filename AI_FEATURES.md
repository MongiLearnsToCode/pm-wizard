# AI Features Guide

## Overview

PM Wizard includes AI-powered features exclusively for **Admin users** to enhance project planning and team management. All AI features use OpenAI's GPT-3.5 Turbo for cost efficiency.

---

## Features

### 1. AI Template Suggestion

**Location:** Project Creation Wizard (Step 1)

**What it does:**
- Analyzes your project description
- Suggests the most appropriate project template
- Provides reasoning for the suggestion

**How to use:**
1. Enter your project description (minimum 10 characters)
2. Click "Get AI Suggestion"
3. Review the suggested template and reasoning
4. Choose to accept or select a different template

**Example:**
```
Description: "Build a mobile app for food delivery"
AI Suggestion: "Software Development - This project involves mobile app development, 
backend APIs, and user interface design, which aligns with the Software Development template."
```

---

### 2. AI Task Generator

**Location:** Project Creation Wizard (Step 3)

**What it does:**
- Breaks down your project goal into 5-8 actionable tasks
- Assigns priority levels (high, medium, low)
- Provides task descriptions

**How to use:**
1. Enter your project goal (minimum 10 characters)
2. Click "Generate Tasks with AI"
3. Review generated tasks
4. Edit, add, or remove tasks as needed
5. Tasks are automatically added to your project

**Example:**
```
Project Goal: "Launch a new website"
Generated Tasks:
- Design mockups (High priority)
- Develop frontend (High priority)
- Write content (Medium priority)
- Set up hosting (Medium priority)
- Test across browsers (Low priority)
```

---

### 3. AI Workload Analysis

**Location:** Admin Dashboard / Project Detail Page

**What it does:**
- Detects team members with >8 active tasks (overloaded)
- Suggests task redistribution strategies
- Helps balance team workload

**How to use:**
1. Navigate to a project with assigned tasks
2. Click "Analyze Team Workload"
3. Review overloaded team members
4. Follow AI suggestions for redistribution

**Example:**
```
Alert: 2 team member(s) are overloaded.
Suggestion: "Consider redistributing tasks from overloaded members to those with 
lighter workloads. Prioritize moving lower-priority tasks first. You may also want 
to extend deadlines for non-critical tasks."
```

---

## Cost Management

### Current Setup
- **Model:** GPT-3.5 Turbo (cost-efficient)
- **Monthly Budget:** $100 USD recommended
- **Rate Limiting:** Not yet implemented (coming with Task 15.0)

### Future Enhancements (Task 15.0)
- **Free Tier:** 5 AI suggestions per project (GPT-3.5)
- **Starter Tier:** 25 AI suggestions per project (GPT-3.5)
- **Growth Tier:** 100 AI suggestions per project (GPT-4 Turbo)

---

## API Endpoints

### POST `/api/ai/suggest-template`
**Auth:** Admin only  
**Body:** `{ "description": string }`  
**Response:** `{ "suggestion": string }`

### POST `/api/ai/suggest-tasks`
**Auth:** Admin only  
**Body:** `{ "projectGoal": string, "stream": boolean }`  
**Response:** `{ "tasks": Array<{ title, description, priority }> }`

### POST `/api/ai/analyze-workload`
**Auth:** Admin only  
**Body:** `{ "projectId": string }`  
**Response:** `{ "analysis": { overloadedUsers, suggestion } }`

---

## Error Handling

All AI endpoints include:
- ✅ Authentication checks
- ✅ Admin role validation
- ✅ Input validation (minimum 10 characters)
- ✅ Error logging
- ✅ Graceful fallbacks

---

## Setup Requirements

### Environment Variables
```bash
OPENAI_API_KEY=sk-...
```

### OpenAI Account Setup
1. Create account at https://platform.openai.com
2. Generate API key
3. Set usage limits ($100/month recommended)
4. Add key to `.env.local`

---

## Best Practices

### For Admins
1. **Use AI as a starting point** - Always review and customize AI suggestions
2. **Provide clear descriptions** - Better input = better AI output
3. **Monitor usage** - Keep track of API costs in OpenAI dashboard
4. **Combine with expertise** - AI suggestions work best when combined with your domain knowledge

### For Developers
1. **Cache responses** - Implement caching for repeated queries (future enhancement)
2. **Monitor costs** - Set up billing alerts in OpenAI dashboard
3. **Handle failures gracefully** - Always provide fallback options
4. **Test with real data** - AI quality depends on input quality

---

## Limitations

- **Admin-only:** Members and Viewers cannot access AI features
- **English only:** Best results with English descriptions
- **No context memory:** Each request is independent
- **Rate limits:** OpenAI has rate limits (60 requests/minute for GPT-3.5)
- **Cost:** Each request costs ~$0.002 (GPT-3.5 Turbo)

---

## Future Enhancements

- [ ] Streaming responses for better UX
- [ ] Response caching to reduce costs
- [ ] Tier-based model selection (GPT-4 for Growth tier)
- [ ] Usage analytics per organization
- [ ] Custom AI prompts per organization
- [ ] Multi-language support

---

## Troubleshooting

### "Admin access required" error
- Ensure you're logged in as an Admin user
- Check your role in the database

### "Failed to generate suggestion" error
- Check OpenAI API key is valid
- Verify you have credits in OpenAI account
- Check network connectivity

### Poor quality suggestions
- Provide more detailed descriptions (>50 characters recommended)
- Be specific about project goals
- Include context and requirements

---

## Support

For issues or questions:
1. Check OpenAI API status: https://status.openai.com
2. Review error logs in browser console
3. Verify environment variables are set correctly
4. Check OpenAI usage dashboard for rate limits

---

**Last Updated:** November 20, 2025
