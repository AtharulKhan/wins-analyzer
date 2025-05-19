
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface SummaryDialogProps {
  summary: string | null;
  onClose: () => void;
}

export function SummaryDialog({ summary, onClose }: SummaryDialogProps) {
  return (
    <AlertDialog open={!!summary} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Win Summary</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="whitespace-pre-line text-base text-foreground">
          {summary}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
