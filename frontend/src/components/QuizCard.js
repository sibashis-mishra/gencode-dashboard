import React, { useState } from 'react';
import { Card, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ShareAltOutlined, FileSearchOutlined } from '@ant-design/icons';
import EditQuizModal from './EditQuizModal'; // Import the EditQuizModal
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const QuizCard = ({ quiz, creator, onEdit, onDelete, onShare, onShowSubmissions }) => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleUpdate = () => {
    onEdit(); // Refresh or update the quiz list after editing
    handleModalClose();
  };

  const handleShowSubmissions = () => {
    navigate(`/submissions?quizId=${quiz._id}`); // Navigate to the Submissions page with quizId
  };

  return (
    <>
      <Card
        style={{ width: 300, margin: '10px', borderRadius: '8px' }}
        actions={[
          <Tooltip title="Edit">
            <Button key="edit" type="link" icon={<EditOutlined />} onClick={handleEdit} />
          </Tooltip>,
          <Tooltip title="Delete">
            <Button key="delete" type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(quiz._id)} />
          </Tooltip>,
          <Tooltip title="Share">
            <Button key="share" type="link" icon={<ShareAltOutlined />} onClick={() => onShare(quiz._id)} />
          </Tooltip>,
          <Tooltip title="Show Submissions">
            <Button key="submissions" type="link" icon={<FileSearchOutlined />} onClick={() => handleShowSubmissions(quiz._id)} />
          </Tooltip>
        ]}
      >
        <Meta title={quiz.title} description={`Created by: ${creator.name || 'Unknown'}`} />
      </Card>

      <EditQuizModal
        visible={modalVisible}
        onClose={handleModalClose}
        quiz={quiz}
        onUpdate={handleUpdate}
        currentUser={creator}
      />
    </>
  );
};

export default QuizCard;
