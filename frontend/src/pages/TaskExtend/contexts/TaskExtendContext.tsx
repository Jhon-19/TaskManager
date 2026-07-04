import { createContext, useContext, useState } from 'react';

const TaskExtendContext = createContext<any>({});

export const TaskExtendProvider = (props: any) => {
  const { children } = props;

  const [selectedDate, setSelectedDate] = useState<string>('');

  const value = {
    selectedDate,
    setSelectedDate,
  }

  return <TaskExtendContext.Provider value={value}>{children}</TaskExtendContext.Provider>;
};

export const useTaskExtendContext = () => {
  const context = useContext(TaskExtendContext);
  if (!context) {
    throw new Error('useTaskExtendContext must be used within a TaskExtendProvider');
  }
  return context;
};