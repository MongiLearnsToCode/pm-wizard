import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function suggestProjectTemplate(description: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a project management expert. Suggest the most appropriate project template based on the description. Choose from: Software Development, Marketing Campaign, Product Launch, Event Planning, or Research Project. Respond with just the template name and a brief reason.',
      },
      {
        role: 'user',
        content: `Project description: ${description}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  return completion.choices[0].message.content;
}

export async function generateTaskBreakdown(projectGoal: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a project management expert. Break down the project goal into 5-8 specific, actionable tasks. Return as JSON array with format: [{"title": "Task name", "description": "Brief description", "priority": "high|medium|low"}]',
      },
      {
        role: 'user',
        content: `Project goal: ${projectGoal}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  const content = completion.choices[0].message.content || '[]';
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function streamTaskBreakdown(projectGoal: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a project management expert. Break down the project goal into 5-8 specific, actionable tasks. Return as JSON array with format: [{"title": "Task name", "description": "Brief description", "priority": "high|medium|low"}]',
      },
      {
        role: 'user',
        content: `Project goal: ${projectGoal}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
    stream: true,
  });

  return stream;
}

export async function analyzeWorkload(tasks: Array<{ assignee_id: string; status: string }>) {
  const taskCounts = tasks.reduce((acc, task) => {
    if (task.status !== 'completed') {
      acc[task.assignee_id] = (acc[task.assignee_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const overloaded = Object.entries(taskCounts)
    .filter(([_, count]) => count > 8)
    .map(([userId]) => userId);

  if (overloaded.length === 0) return null;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a project management expert. Suggest how to redistribute tasks for overloaded team members. Be brief and actionable.',
      },
      {
        role: 'user',
        content: `${overloaded.length} team member(s) have more than 8 active tasks. Suggest redistribution strategies.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return {
    overloadedUsers: overloaded,
    suggestion: completion.choices[0].message.content,
  };
}
