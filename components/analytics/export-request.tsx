'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function ExportRequest() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleRequest = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Create notification for admin
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'export_request',
      title: 'Data Export Requested',
      content: 'A viewer has requested data export approval',
    });

    toast({
      title: 'Export Requested',
      description: 'An admin will review your request',
    });

    setLoading(false);
  };

  return (
    <Button onClick={handleRequest} disabled={loading} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Request Export
    </Button>
  );
}
