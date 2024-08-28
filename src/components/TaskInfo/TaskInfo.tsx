import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal, Input, Popconfirm } from 'antd';
import {Task} from "../../shared/interfaces/Inerfaces.ts";
import taskStore from "../../stores/TaskStore/TaskStore.ts";
import './index.scss'

interface TaskInfoProps {
    selectedTask?: Task;
    onSelectTask: (task?: Task) => void;
}

const TaskInfo = observer(({ selectedTask, onSelectTask }: TaskInfoProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [editingTaskTitle, setEditingTaskTitle] = useState('');
    const [editingTaskDescription, setEditingTaskDescription] = useState('');



    const handleAddSubtask = () => {
        if (selectedTask?.id) {
            taskStore.addTask(newTaskTitle, newTaskDescription, selectedTask.id);
            setModalVisible(false);
            setNewTaskTitle('');
            setNewTaskDescription('');
        }
    };

    const handleEditTask = () => {
        if (selectedTask?.id) {
            taskStore.editTask(selectedTask.id, editingTaskTitle, editingTaskDescription);
            setEditMode(false);
        }
    };

    const handleDeleteTask = () => {
        if (selectedTask?.id) {
            taskStore.deleteTask(selectedTask.id);
            onSelectTask();
        }
    };

    return (
        <div className="task-info__wrapper">
            {!selectedTask
                && <h2>Выберите задачу для отображения информации.</h2>
            }
            <h2>{selectedTask?.title}</h2>
            <p>{selectedTask?.description}</p>
            {selectedTask
                && <div className="buttons-container">
                    <Button
                        type="primary"
                        onClick={() => {
                            setModalVisible(true);
                            setNewTaskTitle('');
                            setNewTaskDescription('');
                        }}
                    >
                        Добавить подзадачу
                    </Button>
                    <Button
                        type="default"
                        onClick={() => {
                            setEditMode(true);
                            if ("title" in selectedTask) {
                                setEditingTaskTitle(selectedTask.title);
                            }
                            if ("description" in selectedTask) {
                                setEditingTaskDescription(selectedTask.description);
                            }
                        }}
                    >
                        Редактировать
                    </Button>
                    <Popconfirm
                        title="Вы уверены, что хотите удалить задачу?"
                        onConfirm={handleDeleteTask}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button
                            type="primary"
                            danger
                        >
                            Удалить
                        </Button>
                    </Popconfirm>
                </div>
            }

            <Modal
                title="Добавить подзадачу"
                visible={modalVisible}
                onOk={handleAddSubtask}
                onCancel={() => setModalVisible(false)}
            >
                <Input
                    placeholder="Название подзадачи"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Input
                    placeholder="Описание подзадачи"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    style={{marginTop: '8px'}}
                />
            </Modal>

            <Modal
                title="Редактировать задачу"
                visible={editMode}
                onOk={handleEditTask}
                onCancel={() => setEditMode(false)}
            >
                <Input
                    placeholder="Название задачи"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                />
                <Input
                    placeholder="Описание задачи"
                    value={editingTaskDescription}
                    onChange={(e) => setEditingTaskDescription(e.target.value)}
                    style={{marginTop: '8px'}}
                />
            </Modal>
        </div>
    );
});

export default TaskInfo;
