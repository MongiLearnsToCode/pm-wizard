'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { UserRole } from '@/lib/database.types';

interface FileUploadProps {
  taskId: string;
  userRole: UserRole;
  onSuccess?: () => void;
}

export function FileUpload({ taskId, userRole, onSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_id', taskId);

    try {
      await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      onSuccess?.();
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const canUpload = userRole === 'admin' || userRole === 'member';

  if (!canUpload) return null;

  return (
    <div>
      <Input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id="file-upload"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
      />
      <label htmlFor="file-upload">
        <Button variant="outline" size="sm" disabled={uploading} asChild>
          <span>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </span>
        </Button>
      </label>
    </div>
  );
}
