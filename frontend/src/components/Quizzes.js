import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message, Modal } from 'antd';
import QuizCard from './QuizCard';
import CreateQuizCard from './CreateQuizCard';
import { del, get, post } from '../utils/api';

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
    Modal.confirm({
      title: 'Are you sure you want to delete this quiz?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await del(`/quizzes/${id}`); // Use the del function to delete the quiz
          message.success('Quiz deleted successfully!');
          setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== id)); // Remove the deleted quiz from the state
        } catch (error) {
          console.error('Failed to delete quiz', error);
          message.error('Failed to delete quiz');
        }
      }
    });
  };

  const handleShare = (id) => {
    // Generate a shareable link or an invitation
    const shareLink = `${window.location.origin}/take-quiz/${id}`;
    navigator.clipboard.writeText(shareLink);
    message.success('Quiz link copied to clipboard!');
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
