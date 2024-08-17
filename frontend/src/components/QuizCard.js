// src/components/QuizCard.js
import React from 'react';
import { Card, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ShareAltOutlined, FileSearchOutlined } from '@ant-design/icons';

const { Meta } = Card;

const QuizCard = ({ quiz, creator, onEdit, onDelete, onShare, onShowSubmissions }) => {
  return (
    <Card
      style={{ width: 300, margin: '10px', borderRadius: '8px' }}
      actions={[
        <Tooltip title="Edit">
          <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => onEdit(quiz._id)} />
        </Tooltip>,
        <Tooltip title="Delete">
          <Button key="delete" type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(quiz._id)} />
        </Tooltip>,
        <Tooltip title="Share">
          <Button key="share" type="link" icon={<ShareAltOutlined />} onClick={() => onShare(quiz._id)} />
        </Tooltip>,
        <Tooltip title="Show Submissions">
          <Button key="submissions" type="link" icon={<FileSearchOutlined />} onClick={() => onShowSubmissions(quiz._id)} />
        </Tooltip>
      ]}
    >
      <Meta title={quiz.title} description={`Created by: ${creator.name || 'Unknown'}`} />
    </Card>
  );
};

export default QuizCard;
