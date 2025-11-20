import { Progress } from '@/components/ui/progress';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({
  currentStep,
  totalSteps,
}: WizardProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-sm text-muted-foreground">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
