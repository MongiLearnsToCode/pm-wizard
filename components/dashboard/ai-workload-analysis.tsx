'use client';

import { useState } from 'react';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WorkloadAnalysisProps {
  projectId: string;
}

export function AiWorkloadAnalysis({ projectId }: WorkloadAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    overloadedUsers: string[];
    suggestion: string;
  } | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/analyze-workload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Failed to analyze workload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Workload Analysis
        </CardTitle>
        <CardDescription>
          Detect overloaded team members and get redistribution suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Analyze Team Workload
            </>
          )}
        </Button>

        {analysis && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Workload Alert</AlertTitle>
            <AlertDescription>
              {analysis.overloadedUsers.length > 0 ? (
                <>
                  <p className="mb-2">
                    {analysis.overloadedUsers.length} team member(s) are overloaded.
                  </p>
                  <p className="text-sm">{analysis.suggestion}</p>
                </>
              ) : (
                <p>Team workload is balanced. No action needed.</p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
