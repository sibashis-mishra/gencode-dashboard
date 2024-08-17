import React from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Radio, Typography } from 'antd';
import '../styles/result.css'; // Import your CSS file

const { Title, Paragraph } = Typography;

const ResultPage = () => {
  const location = useLocation();
  const { result } = location.state || {};
  
  if (!result) {
    return <div>No result data available</div>;
  }

  const { quiz, answers, score, totalPoints } = result;

  // Format percentage to one decimal place
  const formattedPercentage = score.percentage.toFixed(1);

  return (
    <div className="result-container">
      <Title level={2}>Quiz Results</Title>
      <div className="result-summary">
        <Paragraph><strong>Total Marks:</strong> {totalPoints}</Paragraph>
        <Paragraph><strong>Marks Scored:</strong> {score.earnedPoints}</Paragraph>
        <Paragraph><strong>Percentage Scored:</strong> {formattedPercentage}%</Paragraph>
      </div>
      <Form layout="vertical">
        {quiz.questions.map((question, index) => {
          const userAnswer = answers[index]?.answer;
          const isCorrect = question.correctAnswer === userAnswer;
          
          return (
            <Form.Item
              key={question._id}
              label={
                <div className="question-header">
                  <strong>{question.question}</strong>
                  <p className={`correct-answer ${isCorrect ? 'correct' : 'wrong'}`}>
                    Correct Answer: {question.correctAnswer}
                  </p>
                </div>
              }
            >
              <div className="question-options">
                <Radio.Group value={userAnswer} disabled>
                  {question.options.map(option => (
                    <Radio
                      key={option}
                      value={option}
                      className={option === userAnswer ? (isCorrect ? 'selected-correct' : 'selected-wrong') : ''}
                    >
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </Form.Item>
          );
        })}
      </Form>
    </div>
  );
};

export default ResultPage;
