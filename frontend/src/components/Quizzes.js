import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message } from 'antd';
import QuizCard from './QuizCard';
import CreateQuizCard from './CreateQuizCard';
import { get, post } from '../utils/api';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await get('/quizzes');
        const quizzesData = response.data;
        setQuizzes(quizzesData);

        // Extract unique user IDs from quizzes
        const userIds = [...new Set(quizzesData.map(quiz => quiz.creator))];
        
        // Fetch user data
        if (userIds.length > 0) {
          const userResponses = await Promise.all(userIds.map(id => get(`/auth/users/${id}`)));
          const userData = userResponses.reduce((acc, curr) => {
            acc[curr.data._id] = curr.data;
            return acc;
          }, {});
          setUsers(userData);
        }
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleCreateQuiz = async (values) => {
    try {
      await post('/quizzes', values);
      message.success('Quiz created successfully!');
      // Fetch quizzes again to include the new quiz
      const response = await get('/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Failed to create quiz', error);
      message.error('Failed to create quiz');
    }
  };

  const handleEdit = (id) => {
    // Navigate to edit page or open modal for editing
  };

  const handleDelete = (id) => {
    // Call API to delete the quiz
    // Update the state to remove the deleted quiz
  };

  const handleShare = (id) => {
    // Share quiz logic
  };

  const handleShowSubmissions = (id) => {
    // Navigate to submissions page or open modal to show submissions
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <CreateQuizCard onCreate={handleCreateQuiz} />
      <Row gutter={16}>
        {quizzes.map((quiz) => (
          <Col span={8} key={quiz._id}>
            <QuizCard
              quiz={quiz}
              creator={users[quiz.creator] || { name: 'Unknown' }} // Pass user data
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
              onShowSubmissions={handleShowSubmissions}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Quizzes;
