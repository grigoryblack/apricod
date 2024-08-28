import { makeAutoObservable } from 'mobx';
import {Task} from "../../shared/interfaces/Inerfaces.ts";


class TaskStore {
    tasks: Task[] = [];

    constructor() {
        makeAutoObservable(this);
        this.loadTasks();
    }

    addTask(title: string, description: string = '', parentId: string | null = null) {
        const newTask: Task = {
            id: Math.random().toString(),
            title,
            description,
            completed: false,
            subTasks: [],
        };

        if (parentId) {
            const parentTask = this.findTaskById(parentId);
            if (parentTask) {
                parentTask.subTasks.push(newTask);
            }
        } else {
            this.tasks.push(newTask);
        }

        this.saveTasks();
    }

    findTaskById(id: string): Task | undefined {
        const findTask = (tasks: Task[]): Task | undefined => {
            for (const task of tasks) {
                if (task.id === id) return task;
                const found = findTask(task.subTasks);
                if (found) return found;
            }
        };
        return findTask(this.tasks);
    }

    toggleTaskCompletion(id: string) {
        const task = this.findTaskById(id);
        if (task) {
            task.completed = !task.completed;
            this.updateSubTasksCompletion(task, task.completed);
            this.updateParentTaskCompletion(id);
            this.saveTasks();
        }
    }

    updateSubTasksCompletion(task: Task, completed: boolean) {
        task.subTasks.forEach(subTask => {
            subTask.completed = completed;
            this.updateSubTasksCompletion(subTask, completed);
        });
    }

    updateParentTaskCompletion(id: string) {
        const parentTask = this.findParentTask(id);
        if (parentTask) {
            parentTask.completed = parentTask.subTasks.every(subTask => subTask.completed);
            this.updateParentTaskCompletion(parentTask.id);
        }
    }

    findParentTask(id: string): Task | undefined {
        const findParent = (tasks: Task[]): Task | undefined => {
            for (const task of tasks) {
                if (task.subTasks.some(subTask => subTask.id === id)) return task;
                const found = findParent(task.subTasks);
                if (found) return found;
            }
        };
        return findParent(this.tasks);
    }

    editTask(id: string, title: string, description: string) {
        const task = this.findTaskById(id);
        if (task) {
            task.title = title;
            task.description = description;
            this.saveTasks();
        }
    }

    deleteTask(id: string) {
        const deleteTaskFromList = (tasks: Task[]): boolean => {
            const index = tasks.findIndex(task => task.id === id);
            if (index > -1) {
                tasks.splice(index, 1);
                return true;
            } else {
                for (const task of tasks) {
                    if (deleteTaskFromList(task.subTasks)) {
                        return true;
                    }
                }
            }
            return false;
        };

        deleteTaskFromList(this.tasks);
        this.saveTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }
}

const taskStore = new TaskStore();
export default taskStore;
