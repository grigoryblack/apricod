import taskStore from './TaskStore';
import { Task } from '../../shared/interfaces/Inerfaces';

describe('TaskStore', () => {
    beforeEach(() => {
        localStorage.clear();
        taskStore.tasks = [];
    });

    it('should add a task', () => {
        taskStore.addTask('Test task');
        expect(taskStore.tasks.length).toBe(1);
        expect(taskStore.tasks[0].title).toBe('Test task');
        expect(taskStore.tasks[0].description).toBe('');
    });

    it('should toggle task completion', () => {
        taskStore.addTask('Test task');
        const taskId = taskStore.tasks[0].id;
        taskStore.toggleTaskCompletion(taskId);
        expect(taskStore.tasks[0].completed).toBe(true);
    });

    it('should delete a task', () => {
        taskStore.addTask('Test task');
        const taskId = taskStore.tasks[0].id;
        taskStore.deleteTask(taskId);
        expect(taskStore.tasks.length).toBe(0);
    });

    it('should edit a task', () => {
        taskStore.addTask('Test task');
        const taskId = taskStore.tasks[0].id;
        taskStore.editTask(taskId, 'Updated task', 'Updated description');
        expect(taskStore.tasks[0].title).toBe('Updated task');
        expect(taskStore.tasks[0].description).toBe('Updated description');
    });

    it('should add a subtask', () => {
        taskStore.addTask('Parent task');
        const parentTaskId = taskStore.tasks[0].id;
        taskStore.addTask('Subtask', '', parentTaskId);
        expect(taskStore.tasks[0].subTasks.length).toBe(1);
        expect(taskStore.tasks[0].subTasks[0].title).toBe('Subtask');
    });

    it('should toggle completion of a task and its subtasks', () => {
        taskStore.addTask('Parent task');
        const parentTaskId = taskStore.tasks[0].id;
        taskStore.addTask('Subtask 1', '', parentTaskId);
        taskStore.addTask('Subtask 2', '', parentTaskId);

        const parentTask = taskStore.tasks[0];
        taskStore.toggleTaskCompletion(parentTaskId);

        expect(parentTask.completed).toBe(true);
        expect(parentTask.subTasks.every(subTask => subTask.completed)).toBe(true);
    });

    it('should update parent task completion based on subtasks', () => {
        taskStore.addTask('Parent task');
        const parentTaskId = taskStore.tasks[0].id;
        taskStore.addTask('Subtask', '', parentTaskId);
        const subtaskId = taskStore.tasks[0].subTasks[0].id;

        taskStore.toggleTaskCompletion(subtaskId);

        const parentTask = taskStore.findTaskById(parentTaskId);
        expect(parentTask?.completed).toBe(false);

        taskStore.toggleTaskCompletion(subtaskId); // Make the subtask complete

        expect(parentTask?.completed).toBe(true);
    });

    it('should save and load from localStorage', () => {
        taskStore.addTask('Test task');
        taskStore.saveTasks();

        // Clear store and simulate reload
        taskStore.tasks = [];
        localStorage.clear();

        taskStore.loadTasks();

        expect(taskStore.tasks.length).toBe(1);
        expect(taskStore.tasks[0].title).toBe('Test task');
    });
});
