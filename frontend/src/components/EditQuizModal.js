import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber } from 'antd';
import { put } from '../utils/api'; // Assuming you have a `put` function in your API utility
import { PlusOutlined } from '@ant-design/icons';

const EditQuizModal = ({ visible, onClose, quiz, onUpdate, currentUser }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (quiz) {

      form.setFieldsValue({
        title: quiz.title,
        questions: quiz.questions.map(question => ({
          ...question,
          options: question.options.map(option => ({ option })), // Initialize options as objects
          points: question.points || 0 // Ensure points are included
        })) || [] // Default to an empty array if no questions exist
      });
    }
  }, [quiz, form]);

  const handleSubmit = async (values) => {
    try {
      // Debugging: Log the form values before sending to API
      console.log('Form values before submission:', values);

      // Transform options from objects to strings
      const transformedValues = {
        ...values,
        questions: values.questions.map(question => ({
          ...question,
          options: question.options.map(optionObj => optionObj.option), // Convert to an array of strings
        })),
        updatedBy: currentUser._id // Include the current user's ID
      };

      await put(`/quizzes/${quiz._id}`, transformedValues); // Update quiz API endpoint
      onUpdate(); // Refresh the quiz list after update
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to update quiz', error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Edit Quiz"
      okText="Update"
      cancelText="Cancel"
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Quiz Title"
          rules={[{ required: true, message: 'Please enter the quiz title' }]}
        >
          <Input />
        </Form.Item>
        <Form.List
          name="questions"
          rules={[{ validator: async(_, questions) => { if (!questions || questions.length < 1) return Promise.reject('At least one question is required.'); } }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, 'question']}
                    fieldKey={[fieldKey, 'question']}
                    label="Question"
                    rules={[{ required: true, message: 'Please enter the question' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.List
                    name={[name, 'options']}
                    initialValue={form.getFieldValue(['questions', name, 'options']) || []} // Set initial value for options
                    rules={[{ validator: async(_, options) => { if (!options || options.length < 2) return Promise.reject('At least two options are required.'); } }]}
                  >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Form.Item
                            {...restField}
                            name={[name, 'option']}
                            fieldKey={[fieldKey, 'option']}
                            label="Option"
                            rules={[{ required: true, message: 'Please enter an option' }]}
                          >
                            <Input />
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Option
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Form.Item
                    name={[name, 'correctAnswer']}
                    label="Correct Answer"
                    rules={[{ required: true, message: 'Please select the correct answer' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'points']}
                    label="Score for Correct Answer"
                    rules={[{ required: true, message: 'Please enter the score' }]}
                  >
                    <InputNumber min={1} max={100} />
                  </Form.Item>
                  <Button type="link" onClick={() => remove(name)}>
                    Remove Question
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Question
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default EditQuizModal;
