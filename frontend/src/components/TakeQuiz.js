import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin, Radio } from 'antd';
import { get, post } from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/takequiz.css'; // Import your CSS file

const TakeQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate hook

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await get(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Failed to fetch quiz', error);
        message.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSubmit = async (values) => {
    const { name, ...answerFields } = values;

    // Prepare answers array in the required format
    const answers = quiz.questions.map((question, index) => ({
      questionId: question._id,
      answer: answerFields[`answers[${index}]`] // Updated to handle single answer per question
    }));

    // Calculate total points and earned points
    const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);
    const earnedPoints = quiz.questions.reduce((sum, question) => {
      const userAnswer = answers.find(answer => answer.questionId === question._id)?.answer;
      return question.correctAnswer === userAnswer ? sum + question.points : sum;
    }, 0);
    const score = (earnedPoints / totalPoints) * 100;

    try {
      await post('/submissions', {
        quizId,
        fullName: name,
        answers,
        score,
      });
      // Redirect to result page with the result data
      navigate('/result', {
        state: {
          result: {
            quiz,
            answers,
            score: {
              earnedPoints,
              percentage: score
            },
            totalPoints
          }
        }
      });
    } catch (error) {
      console.error('Failed to submit quiz', error);
      message.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{quiz.title}</h2>
      <Form onFinish={handleSubmit} layout="vertical" className="quiz-form">
        <Form.Item name="name" label="Your Name" rules={[{ required: true, message: 'Please enter your name!' }]}>
          <Input />
        </Form.Item>
        {quiz.questions.map((question, index) => (
          <Form.Item
            key={question._id}
            name={`answers[${index}]`}
            label={question.question}
            rules={[{ required: true, message: 'Please select an option!' }]}
          >
            <Radio.Group>
              {question.options.map(option => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        ))}
        <Button type="primary" htmlType="submit" className="submit-button">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default TakeQuiz;
