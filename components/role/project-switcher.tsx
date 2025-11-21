'use client';

import { useRouter } from 'next/navigation';
import { useProjectContext } from '@/store/project-context-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, FolderKanban } from 'lucide-react';

export function ProjectSwitcher() {
  const router = useRouter();
  const { 
    currentProjectId, 
    currentProjectName, 
    currentProjectRole,
    availableProjects,
    setCurrentProject 
  } = useProjectContext();

  const handleSwitch = (projectId: string, role: string, name: string) => {
    setCurrentProject(projectId, role as any, name);
    router.push(`/${role}/dashboard`);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-500';
      case 'member': return 'bg-green-500';
      case 'viewer': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (!currentProjectName) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="truncate">{currentProjectName}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableProjects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleSwitch(project.id, project.role, project.name)}
            className={currentProjectId === project.id ? 'bg-muted' : ''}
          >
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{project.name}</span>
              <Badge className={`ml-2 ${getRoleBadgeColor(project.role)}`}>
                {project.role}
              </Badge>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
