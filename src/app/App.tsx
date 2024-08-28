import { useState } from 'react';
import TaskTree from "../components/TaskTree/TaskTree.tsx";
import TaskInfo from "../components/TaskInfo/TaskInfo.tsx";
import {Task} from "../shared/interfaces/Inerfaces.ts";
import './App.scss';

function App() {
    const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

    const handleSelectTask = (task?: Task) => {
        setSelectedTask(task);
    };

    return (
        <div className="main-wrapper">
            <TaskTree onSelectTask={handleSelectTask} />
            <TaskInfo selectedTask={selectedTask} onSelectTask={handleSelectTask} />
        </div>
    );
}

export default App;
