import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Card, Button } from 'antd';
import { get } from '../utils/api'; // Assuming you have a `get` function in your API utility
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/submissions.css'; // Import the CSS file

const Submissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const quizId = queryParams.get('quizId');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const endpoint = quizId ? `/submissions/quizzes/${quizId}` : '/submissions';
        const response = await get(endpoint);
  
        // Ensure that quizName is extracted from the quiz object
        const submissionsWithQuizName = response.data.map(submission => ({
          ...submission,
          quizName: submission.quiz ? submission.quiz.title : '[Deleted]', // Handle missing quiz
        }));
  
        setSubmissions(submissionsWithQuizName);
        setShowBackButton(!!quizId); // Show back button if quizId exists
      } catch (error) {
        console.error('Failed to fetch submissions', error);
        message.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubmissions();
  }, [quizId]);

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  // Calculate score distribution
  const calculateScoreDistribution = () => {
    const distribution = {};
    submissions.forEach(submission => {
      const score = submission.score;
      if (distribution[score]) {
        distribution[score] += 1;
      } else {
        distribution[score] = 1;
      }
    });
    return distribution;
  };

  const scoreDistribution = calculateScoreDistribution();
  const distributionEntries = Object.entries(scoreDistribution)
    .map(([score, count]) => ({
      score: Number(score),
      count,
    }))
    .sort((a, b) => b.score - a.score); // Sort by score in descending order

  // Define columns conditionally
  const columns = [
    ...(quizId ? [] : [{
      title: 'Quiz Name',
      dataIndex: 'quizName',
      key: 'quizName',
      sorter: (a, b) => a.quizName.localeCompare(b.quizName), // Sort alphabetically
    }]),
    {
      title: 'Name',
      dataIndex: 'user',
      key: 'user',
      sorter: (a, b) => a.user.localeCompare(b.user), // Sort alphabetically
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score, // Sort by score, low to high
    },
    {
      title: 'Submission Date',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt), // Sort by date, recent to last
      render: text => {
        const date = new Date(text);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
      },
    },
  ];

  const handleExportExcel = () => {
    // Convert submissions data to worksheet
    const ws = XLSX.utils.json_to_sheet(submissions);
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
    // Write the workbook to file
    XLSX.writeFile(wb, 'submissions.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      ...(quizId ? [] : ["Quiz Name"]),
      "Name",
      "Score",
      "Submission Date"
    ];
    const tableRows = submissions.map(submission => [
      ...(quizId ? [] : submission.quizName),
      submission.user,
      submission.score,
      new Date(submission.submittedAt).toLocaleString(),
    ]);

    doc.autoTable(tableColumn, tableRows, { margin: { top: 20 } });
    doc.save('submissions.pdf');
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="submissions-container">
      {showBackButton && (
        <Button
          type="primary"
          onClick={handleBackToQuizzes}
          className="back-to-quizzes-button"
        >
          Back to Quizzes
        </Button>
      )}
      <Card
        title="Score Distribution"
        className="score-distribution-card"
      >
        <div className="score-distribution-buttons">
          <Button 
            type="primary" 
            onClick={handleExportExcel} 
            className="export-button"
          >
            Export to Excel
          </Button>
          <Button 
            type="primary" 
            onClick={handleExportPDF} 
            className="export-button"
          >
            Export to PDF
          </Button>
        </div>
        {distributionEntries.map(({ score, count }) => (
          <div key={score} className="score-distribution-item">
            <strong>Score {score}:</strong> {count} {count > 1 ? 'submissions' : 'submission'}
          </div>
        ))}
      </Card>
      <Table
        dataSource={submissions}
        columns={columns}
        rowKey={record => record._id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Submissions;
