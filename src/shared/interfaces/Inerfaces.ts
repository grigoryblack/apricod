export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    subTasks: Task[];
}

export interface TaskTreeProps {
    task: Task;
    onSelect: (task: Task) => void;
}