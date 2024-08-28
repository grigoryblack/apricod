import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Tree, Checkbox, Button, Modal, Input } from 'antd';
import { Task } from "../../shared/interfaces/Inerfaces.ts";
import taskStore from "../../stores/TaskStore/TaskStore.ts";
import './index.scss';

interface TaskTreeProps {
    onSelectTask: (task?: Task) => void;
}

interface TreeNode {
    title: React.ReactNode;
    key: string;
    children?: TreeNode[];
}

const TaskTree = observer(({ onSelectTask }: TaskTreeProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const buildTreeNodes = (tasks: Task[]): TreeNode[] => {
        return tasks
            .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(task => ({
                title: (
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Checkbox
                            checked={task.completed}
                            onChange={() => handleCheckboxChange(task.id)}
                            style={{ marginRight: '8px' }}
                        />
                        <span onClick={() => handleTaskClick(task)}>{task.title}</span>
                    </div>
                ),
                key: task.id,
                children: buildTreeNodes(task.subTasks),
            }));
    };

    const handleTaskClick = (task: Task) => {
        onSelectTask(task);
    };

    const handleCheckboxChange = (taskId: string) => {
        taskStore.toggleTaskCompletion(taskId);
    };

    const handleAddTask = () => {
        if (newTaskTitle) {
            taskStore.addTask(newTaskTitle, newTaskDescription);
            setModalVisible(false);
            setNewTaskTitle('');
            setNewTaskDescription('');
        }
    };

    return (
        <div className="task-tree__wrapper">
            <h1>Список задач</h1>
            <Input.Search
                placeholder="Поиск задач..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                type="primary"
                onClick={() => setModalVisible(true)}
                style={{ margin: '16px' }}
            >
                Добавить задачу
            </Button>
            <Tree
                treeData={buildTreeNodes(taskStore.tasks)}
                onSelect={(selectedKeys) => {
                    const taskId = selectedKeys[0] as string;
                    if (taskId) {
                        handleTaskClick(taskStore.findTaskById(taskId) || {} as Task);
                    }
                }}
                style={{ height: 'calc(100% - 50px)', overflow: 'auto' }}
            />
            <Modal
                title="Добавить задачу"
                visible={modalVisible}
                onOk={handleAddTask}
                onCancel={() => setModalVisible(false)}
            >
                <Input
                    placeholder="Название задачи"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Input
                    placeholder="Описание задачи"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    style={{ marginTop: '8px' }}
                />
            </Modal>
        </div>
    );
});

export default TaskTree;
