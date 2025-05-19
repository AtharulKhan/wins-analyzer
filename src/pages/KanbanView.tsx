
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Draggable, Droppable, DragDropContext } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';

const mockData = {
  'Completed': [
    { id: '1', content: 'Google Drive AI Analyzer (App)', date: '2025-05-18' },
    { id: '2', content: 'Combine All Tabs in One Master Tab', date: '2025-05-18' },
  ],
  'In Progress': [
    { id: '3', content: 'LinkedIn Automated Email/Info Scraper', date: '2025-05-16' },
  ],
  'To Do': [
    { id: '4', content: 'AI Summarize From Sheets Cell', date: '2025-05-14' },
  ]
};

const KanbanView = () => {
  const { toast } = useToast();
  const [columns, setColumns] = useState(mockData);

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // No change
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the item
    const sourceColumn = columns[source.droppableId];
    const item = sourceColumn.find(item => item.id === draggableId);
    
    if (!item) return;

    // Creating new column states
    const newColumns = { ...columns };
    
    // Remove from source
    newColumns[source.droppableId] = newColumns[source.droppableId].filter(
      item => item.id !== draggableId
    );
    
    // Add to destination
    newColumns[destination.droppableId] = [
      ...newColumns[destination.droppableId].slice(0, destination.index),
      item,
      ...newColumns[destination.droppableId].slice(destination.index)
    ];
    
    setColumns(newColumns);
    
    toast({
      title: "Item Moved",
      description: `"${item.content}" moved to ${destination.droppableId}`,
      variant: "default"
    });
  };

  return (
    <PageLayout title="Kanban View">
      <div className="mb-4">
        <p className="text-muted-foreground">Drag items between columns to organize your wins by status.</p>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(columns).map(([columnId, items]) => (
            <div key={columnId} className="flex flex-col">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{columnId}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Droppable droppableId={columnId}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2 bg-card hover:bg-accent cursor-grab active:cursor-grabbing"
                              >
                                <CardContent className="p-3">
                                  <div className="font-medium">{item.content}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{item.date}</div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </PageLayout>
  );
};

export default KanbanView;
