import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Card, Button, Input, DatePicker, Select, Tooltip, Modal } from 'antd';
import { get } from '../utils/api'; // Assuming you have a `get` function in your API utility
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ArrowLeftOutlined, FilterOutlined, FileExcelOutlined, FilePdfOutlined, BarChartOutlined } from '@ant-design/icons';
import { PieChart, Pie, Tooltip as RechartsTooltip, Cell } from 'recharts';
import '../styles/submissions.css'; // Import the CSS file
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // Import the isBetween plugin
import advancedFormat from 'dayjs/plugin/advancedFormat'; // Import the advancedFormat plugin for other functionalities

dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin
dayjs.extend(advancedFormat); // Extend dayjs with advancedFormat if needed

const { RangePicker } = DatePicker;
const { Option } = Select;

const Submissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const quizId = queryParams.get('quizId');
  const [submissions, setSubmissions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [minScore, setMinScore] = useState(null);
  const [maxScore, setMaxScore] = useState(null);
  const [selectedQuizName, setSelectedQuizName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showScoreDistribution, setShowScoreDistribution] = useState(false);
  const [scoreDistribution, setScoreDistribution] = useState({}); // Added state for score distribution

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const endpoint = quizId ? `/submissions/quizzes/${quizId}` : '/submissions';
        const response = await get(endpoint);

        const submissionsWithQuizName = response.data.map(submission => ({
          ...submission,
          quizName: submission.quiz ? submission.quiz.title : '[Deleted]', // Handle missing quiz
        }));

        setSubmissions(submissionsWithQuizName);
        setFilteredData(submissionsWithQuizName);
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

  useEffect(() => {
    // Filter data based on search text, date range, score range, and quiz name
    const applyFilters = () => {
      let data = [...submissions];
      
      if (searchText) {
        data = data.filter(item =>
          item.user.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      if (dateRange[0] && dateRange[1]) {
        data = data.filter(item => {
          const submissionDate = dayjs(item.submittedAt);
          return submissionDate.isBetween(dayjs(dateRange[0]), dayjs(dateRange[1]), 'day', '[]');
        });
      }
      
      if (minScore !== null && maxScore !== null) {
        data = data.filter(item =>
          item.score >= minScore && item.score <= maxScore
        );
      }

      if (selectedQuizName) {
        data = data.filter(item => item.quizName === selectedQuizName);
      }

      setFilteredData(data);
      setScoreDistribution(calculateScoreDistribution(data)); // Update score distribution
    };
    
    applyFilters();
  }, [searchText, dateRange, minScore, maxScore, selectedQuizName, submissions]);

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  // Calculate score distribution
  const calculateScoreDistribution = (data) => {
    const distribution = {};
    data.forEach(submission => {
      const score = submission.score;
      if (distribution[score]) {
        distribution[score] += 1;
      } else {
        distribution[score] = 1;
      }
    });
    return distribution;
  };

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
      filters: Array.from(new Set(submissions.map(sub => sub.quizName)))
        .map(quizName => ({ text: quizName, value: quizName })),
      onFilter: (value, record) => record.quizName === value,
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
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
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
    const tableRows = filteredData.map(submission => [
      ...(quizId ? [] : submission.quizName),
      submission.user,
      submission.score,
      new Date(submission.submittedAt).toLocaleString(),
    ]);

    doc.autoTable(tableColumn, tableRows, { margin: { top: 20 } });
    doc.save('submissions.pdf');
  };

  const handleQuizNameChange = (value) => {
    if (value === 'all') {
      setSelectedQuizName(''); // Reset the filter
    } else {
      setSelectedQuizName(value); // Set the selected quiz name
    }
  };

  const handleShowFilters = () => {
    setShowFilters(true);
  };

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  const handleShowScoreDistribution = () => {
    setShowScoreDistribution(true);
  };

  const handleCloseScoreDistribution = () => {
    setShowScoreDistribution(false);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="submissions-container">
      {showBackButton && (
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToQuizzes}
          style={{ marginBottom: 20 }}
        >
          Back to Quizzes
        </Button>
      )}
      <div className="header-controls">
        <div className="total-submissions">
          Total Submissions: {filteredData.length}
        </div>
        <div className="action-buttons">
          <Tooltip title="Show Filters">
            <Button
              icon={<FilterOutlined />}
              onClick={handleShowFilters}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Show Score Distribution">
            <Button
              icon={<BarChartOutlined />}
              onClick={handleShowScoreDistribution}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Export to PDF">
            <Button
              icon={<FilePdfOutlined />}
              onClick={handleExportPDF}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="Export to Excel">
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              className="action-button"
            />
          </Tooltip>
        </div>
      </div>

      {/* Filters Modal */}
      <Modal
        title="Filters"
        visible={showFilters}
        onCancel={handleCloseFilters}
        footer={null}
        className="filters-modal"
      >
        <Input
          placeholder="Search by name"
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          className="filter-field"
        />
        <RangePicker
          onChange={dates => setDateRange(dates)}
          value={dateRange}
          className="filter-field"
        />
        <Input
          placeholder="Min Score"
          type="number"
          onChange={e => setMinScore(Number(e.target.value))}
          value={minScore !== null ? minScore : ''}
          className="filter-field"
        />
        <Input
          placeholder="Max Score"
          type="number"
          onChange={e => setMaxScore(Number(e.target.value))}
          value={maxScore !== null ? maxScore : ''}
          className="filter-field"
        />
        <Select
          placeholder="Select Quiz"
          onChange={handleQuizNameChange}
          value={selectedQuizName || 'all'}
          style={{ width: '100%' }}
          className="filter-field"
        >
          <Option value="all">All Quizzes</Option>
          {[...new Set(submissions.map(sub => sub.quizName))].map(quizName => (
            <Option key={quizName} value={quizName}>{quizName}</Option>
          ))}
        </Select>
      </Modal>

      {/* Score Distribution Modal */}
      <Modal
        title="Score Distribution"
        visible={showScoreDistribution}
        onCancel={handleCloseScoreDistribution}
        footer={null}
        className="score-distribution-modal"
      >
        {distributionEntries.length ? (
          <div className="pie-chart-container">
            <PieChart width={500} height={400}>
              <Pie
                data={distributionEntries}
                dataKey="count"
                nameKey="score"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {distributionEntries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0088FE' : '#00C49F'} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </div>
        ) : (
          <p>No score distribution available</p>
        )}
      </Modal>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={true}
      />
    </div>
  );
};

export default Submissions;
