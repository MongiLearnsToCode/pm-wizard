'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/posthog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WizardStep } from './wizard-step';
import { WizardProgress } from './wizard-progress';
import { RoleAssignmentStep } from './role-assignment-step';
import { PROJECT_TEMPLATES } from '@/lib/project-templates';
import { Card, CardContent } from '@/components/ui/card';

export function ProjectWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    description: '',
    template: '',
    roleAssignments: [],
    deadline: '',
  });
  const router = useRouter();
  const supabase = createClient();
  const totalSteps = 5;

  useEffect(() => {
    loadDraft();
    trackEvent('wizard_started', { role: 'admin' });
  }, []);

  useEffect(() => {
    if (step > 1) {
      saveDraft();
    }
  }, [data, step]);

  async function loadDraft() {
    const response = await fetch('/api/wizard/drafts');
    const draft = await response.json();
    if (draft?.draft_data) {
      setData(draft.draft_data);
      setStep(draft.step || 1);
    }
  }

  async function saveDraft() {
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single();

    if (orgs) {
      await fetch('/api/wizard/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: (orgs as any).id,
          draft_data: data,
          step,
        }),
      });
    }
  }

  async function handleComplete() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
      .single();

    if (!orgs) return;

    // Create project
    const { data: project } = await supabase
      .from('projects')
      .insert({
        organization_id: (orgs as any).id,
        name: data.name,
        description: data.description,
        deadline: data.deadline || null,
        created_by: user.id,
        status: 'active',
      } as any)
      .select()
      .single();

    if (project) {
      trackEvent('project_created', {
        role: 'admin',
        template: data.template,
        team_size: data.roleAssignments.length,
      });

      // Assign roles
      for (const assignment of data.roleAssignments as any[]) {
        await supabase.from('user_project_roles').insert({
          user_id: assignment.userId,
          project_id: (project as any).id,
          role: assignment.role,
        } as any);
      }

      // Create tasks from template
      const template = PROJECT_TEMPLATES.find((t) => t.id === data.template);
      if (template?.tasks.length) {
        for (const taskTitle of template.tasks) {
          await supabase.from('tasks').insert({
            project_id: (project as any).id,
            title: taskTitle,
            created_by: user.id,
          } as any);
        }
      }

      // Clear draft
      await fetch('/api/wizard/drafts', { method: 'DELETE' });

      router.push('/admin/dashboard');
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <WizardStep
            title="What's your project name?"
            description="Give your project a clear, descriptive name"
          >
            <div className="space-y-4">
              <Input
                placeholder="e.g., Website Redesign"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                autoFocus
              />
            </div>
          </WizardStep>
        );

      case 2:
        return (
          <WizardStep
            title="Describe your project"
            description="What are you trying to achieve?"
          >
            <Textarea
              placeholder="Project goals and objectives..."
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              rows={5}
            />
          </WizardStep>
        );

      case 3:
        return (
          <WizardStep
            title="Choose a template"
            description="Select a template or start from scratch"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {PROJECT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-colors ${
                    data.template === template.id
                      ? 'border-primary'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setData({ ...data, template: template.id })}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </WizardStep>
        );

      case 4:
        return (
          <WizardStep
            title="Assign team members"
            description="Select team members and assign their roles"
          >
            <RoleAssignmentStep
              value={data.roleAssignments as any}
              onChange={(assignments) =>
                setData({ ...data, roleAssignments: assignments as any })
              }
            />
          </WizardStep>
        );

      case 5:
        return (
          <WizardStep
            title="Set a deadline (optional)"
            description="When should this project be completed?"
          >
            <div className="space-y-4">
              <Label>Project Deadline</Label>
              <Input
                type="date"
                value={data.deadline}
                onChange={(e) => setData({ ...data, deadline: e.target.value })}
              />
            </div>
          </WizardStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <WizardProgress currentStep={step} totalSteps={totalSteps} />

      {renderStep()}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={saveDraft}>
            Save Draft
          </Button>
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)} disabled={!data.name}>
              Next
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!data.name}>
              Create Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
