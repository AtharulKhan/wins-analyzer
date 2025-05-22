
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Win } from './useDashboardData';

interface CategoryWinsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string | null;
  categoryWins: Win[];
}

export const CategoryWinsDialog: React.FC<CategoryWinsDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedCategory, 
  categoryWins 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedCategory ? `Wins in "${selectedCategory}" (${categoryWins.length})` : 'Category Wins'}
          </DialogTitle>
        </DialogHeader>
        
        {categoryWins.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No wins found in this category.</p>
          </div>
        ) : (
          <div className="space-y-4 p-2">
            {categoryWins.map((win) => (
              <div key={win.id} className="border-b pb-3 last:border-b-0">
                <h3 className="font-medium text-lg">{win.title}</h3>
                <div className="flex gap-2 text-sm text-muted-foreground mb-2">
                  <span>{new Date(win.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                {win.desc && <p className="text-sm">{win.desc}</p>}
                {win.link && (
                  <a 
                    href={win.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    View Details
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
