'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AiTemplateSuggestionProps {
  description: string;
  onSuggestion: (suggestion: string) => void;
}

export function AiTemplateSuggestion({ description, onSuggestion }: AiTemplateSuggestionProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleGetSuggestion = async () => {
    if (!description || description.length < 10) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      if (data.suggestion) {
        setSuggestion(data.suggestion);
        onSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI Template Suggestion
        </CardTitle>
        <CardDescription>
          Let AI suggest the best template for your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGetSuggestion}
          disabled={loading || !description || description.length < 10}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestion
            </>
          )}
        </Button>

        {suggestion && (
          <div className="mt-4 rounded-lg bg-white p-3 text-sm dark:bg-gray-900">
            <p className="text-muted-foreground">{suggestion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
