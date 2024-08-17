// src/components/CreateQuizCard.js
import React, { useState } from 'react';
import { Card, Button, Tooltip, Modal, Form, Input, Button as AntButton, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/createquizcard.css'; // Import the CSS file

const CreateQuizCard = ({ onCreate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = () => {
    form.validateFields().then(values => {
      onCreate(values);
      form.resetFields();
      setIsModalVisible(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <>
      <Card
        className="create-quiz-card"
        bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        shadow
        style={{ borderRadius: '8px', height: '150px', margin: '10px', textAlign: 'center' }}
      >
        <Tooltip title="Create New Quiz">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            onClick={showModal}
            className="create-quiz-card-button"
            style={{ fontSize: '24px', color: '#fff', backgroundColor: '#1890ff' }}
          />
        </Tooltip>
        <div className="create-quiz-card-text" style={{ fontSize: '16px', color: '#666', textAlign: 'center' }}>
          Create New Quiz
        </div>
      </Card>

      <Modal
        title="Create New Quiz"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleCreate}
        okText="Create"
        cancelText="Cancel"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          name="create_quiz"
          initialValues={{
            title: '',
            questions: [{ question: '', options: [''], correctAnswer: '', score: '' }]
          }}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="Quiz Title"
            rules={[{ required: true, message: 'Please input the quiz title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.List
            name="questions"
            initialValue={[{ question: '', options: [''], correctAnswer: '', score: '' }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} style={{ marginBottom: '16px' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'question']}
                      fieldKey={[fieldKey, 'question']}
                      label={`Question ${name + 1}`}
                      rules={[{ required: true, message: 'Please input the question!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.List
                      name={[name, 'options']}
                      fieldKey={[fieldKey, 'options']}
                    >
                      {(optionFields, { add: addOption, remove: removeOption }) => (
                        <>
                          {optionFields.map(({ key: optionKey, name: optionName, fieldKey: optionFieldKey, ...optionRestField }) => (
                            <Form.Item
                              {...optionRestField}
                              name={[optionName]}
                              fieldKey={[optionFieldKey]}
                              label={`Option ${optionName + 1}`}
                              rules={[{ required: true, message: 'Please input an option!' }]}
                              key={optionKey}
                            >
                              <Input placeholder="Option text" />
                            </Form.Item>
                          ))}
                          <AntButton
                            type="dashed"
                            onClick={() => addOption()}
                            block
                            style={{ marginBottom: '8px' }}
                          >
                            Add Option
                          </AntButton>
                        </>
                      )}
                    </Form.List>

                    <Form.Item
                      {...restField}
                      name={[name, 'correctAnswer']}
                      fieldKey={[fieldKey, 'correctAnswer']}
                      label="Correct Answer"
                      rules={[{ required: true, message: 'Please input the correct answer!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'score']}
                      fieldKey={[fieldKey, 'score']}
                      label="Score"
                      rules={[{ required: true, message: 'Please input the score for this question!' }]}
                    >
                      <Input type="number" />
                    </Form.Item>

                    <AntButton type="dashed" onClick={() => remove(name)} style={{ marginBottom: '8px' }}>
                      Remove Question
                    </AntButton>
                  </div>
                ))}

                <AntButton type="dashed" onClick={() => add()} block>
                  Add Question
                </AntButton>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default CreateQuizCard;
