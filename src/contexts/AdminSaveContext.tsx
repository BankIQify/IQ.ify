import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdminSaveContextType {
  isSaving: boolean;
  saveAll: () => Promise<void>;
  registerSaveHandler: (handler: () => Promise<void>) => void;
  unregisterSaveHandler: (handler: () => Promise<void>) => void;
}

const AdminSaveContext = createContext<AdminSaveContextType | undefined>(undefined);

export const AdminSaveProvider = ({ children }: { children: ReactNode }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveHandlers, setSaveHandlers] = useState<(() => Promise<void>)[]>([]);
  const { toast } = useToast();

  const registerSaveHandler = (handler: () => Promise<void>) => {
    setSaveHandlers(prev => [...prev, handler]);
  };

  const unregisterSaveHandler = (handler: () => Promise<void>) => {
    setSaveHandlers(prev => prev.filter(h => h !== handler));
  };

  const saveAll = async () => {
    try {
      setIsSaving(true);
      
      // Run all save handlers in parallel
      await Promise.all(saveHandlers.map(handler => handler()));
      
      toast({
        title: "Success",
        description: "All changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save changes. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminSaveContext.Provider value={{ isSaving, saveAll, registerSaveHandler, unregisterSaveHandler }}>
      {children}
    </AdminSaveContext.Provider>
  );
};

export const useAdminSave = () => {
  const context = useContext(AdminSaveContext);
  if (context === undefined) {
    throw new Error('useAdminSave must be used within an AdminSaveProvider');
  }
  return context;
}; 