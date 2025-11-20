import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProjectCardProps {
  name: string;
  status: string;
  progress: number;
  teamSize: number;
  readOnly?: boolean;
}

export function ProjectCard({
  name,
  status,
  progress,
  teamSize,
  readOnly = false,
}: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Team: {teamSize} members</span>
          {readOnly && <span className="text-xs">View Only</span>}
        </div>
      </CardContent>
    </Card>
  );
}
