import  { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Input, Button, Form, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import taskStore from "../stores/TaskStore/TaskStore.ts";

const { Sider, Content } = Layout;

const App: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [form] = Form.useForm();

    const handleAddTask = () => {
        form
            .validateFields()
            .then(values => {
                taskStore.addTask(values.title, values.description);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={300} theme="light">
                <div style={{ padding: '20px' }}>
                    <Form form={form} layout="vertical" onFinish={handleAddTask}>
                        <Form.Item name="title" rules={[{ required: true, message: 'Please input task title!' }]}>
                            <Input placeholder="Task title" />
                        </Form.Item>
                        <Form.Item name="description">
                            <Input.TextArea placeholder="Task description" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block icon={<PlusOutlined />}>
                                Add Task
                            </Button>
                        </Form.Item>
                    </Form>
                    <List
                        itemLayout="horizontal"
                        dataSource={taskStore.tasks}
                        renderItem={task => (
                            <TaskTree key={task.id} task={task} onSelect={setSelectedTask} />
                        )}
                    />
                </div>
            </Sider>
            <Layout>
                <Content style={{ padding: '20px' }}>
                    {selectedTask ? (
                        <div>
                            <h3>{selectedTask.title}</h3>
                            <p>{selectedTask.description}</p>
                            <Button
                                type="primary"
                                onClick={() =>
                                    taskStore.editTask(
                                        selectedTask.id,
                                        prompt('New title', selectedTask.title) || selectedTask.title,
                                        prompt('New description', selectedTask.description) || selectedTask.description
                                    )
                                }
                            >
                                Edit Task
                            </Button>
                        </div>
                    ) : (
                        <p>Select a task to see details</p>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default observer(App);
