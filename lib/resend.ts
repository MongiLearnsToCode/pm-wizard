import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'notifications@pmwizard.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

export async function sendTaskAssignedEmail(
  to: string,
  taskTitle: string,
  projectName: string
) {
  const html = `
    <h1>New Task Assigned</h1>
    <p>You have been assigned a new task:</p>
    <h2>${taskTitle}</h2>
    <p>Project: ${projectName}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/member/dashboard">View Task</a></p>
  `;

  await sendEmail(to, 'New Task Assigned', html);
}

export async function sendMentionEmail(
  to: string,
  mentionerName: string,
  taskTitle: string
) {
  const html = `
    <h1>You were mentioned</h1>
    <p>${mentionerName} mentioned you in a comment on:</p>
    <h2>${taskTitle}</h2>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}">View Comment</a></p>
  `;

  await sendEmail(to, 'You were mentioned', html);
}

export async function sendDueReminderEmail(
  to: string,
  taskTitle: string,
  dueDate: string
) {
  const html = `
    <h1>Task Due Soon</h1>
    <p>Your task is due soon:</p>
    <h2>${taskTitle}</h2>
    <p>Due: ${dueDate}</p>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/member/dashboard">View Task</a></p>
  `;

  await sendEmail(to, 'Task Due Soon', html);
}

export async function sendWeeklyDigestEmail(
  to: string,
  stats: { completedTasks: number; activeProjects: number }
) {
  const html = `
    <h1>Weekly Digest</h1>
    <p>Here's your weekly summary:</p>
    <ul>
      <li>Completed Tasks: ${stats.completedTasks}</li>
      <li>Active Projects: ${stats.activeProjects}</li>
    </ul>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/viewer/dashboard">View Dashboard</a></p>
  `;

  await sendEmail(to, 'Weekly Digest', html);
}
