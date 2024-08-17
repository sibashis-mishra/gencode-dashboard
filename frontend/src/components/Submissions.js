import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { get } from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import HeaderControls from './HeaderControls';
import FiltersModal from './FiltersModal';
import ScoreDistributionModal from './ScoreDistributionModal';
import SubmissionsTable from './SubmissionsTable';
import '../styles/submissions.css';

dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

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
  const [scoreDistribution, setScoreDistribution] = useState({});

  useEffect(() => {
    fetchSubmissions();
  }, [quizId]);

  useEffect(() => {
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
      setScoreDistribution(calculateScoreDistribution(data));
    };

    applyFilters();
  }, [searchText, dateRange, minScore, maxScore, selectedQuizName, submissions]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const endpoint = quizId ? `/submissions/quizzes/${quizId}` : '/submissions';
      const response = await get(endpoint);

      const submissionsWithQuizName = response.data.map(submission => ({
        ...submission,
        quizName: submission.quiz ? submission.quiz.title : '[Deleted]',
      }));

      setSubmissions(submissionsWithQuizName);
      setFilteredData(submissionsWithQuizName);
      setShowBackButton(!!quizId);
    } catch (error) {
      message.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSubmissions();
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

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    XLSX.writeFile(workbook, 'submissions.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Quiz', 'Score', 'Date']],
      body: filteredData.map(submission => [
        submission.user,
        submission.quizName,
        submission.score,
        dayjs(submission.submittedAt).format('MMMM Do YYYY, h:mm A'),
      ]),
    });
    doc.save('submissions.pdf');
  };

  const calculateScoreDistribution = (data) => {
    const distribution = data.reduce((acc, submission) => {
      acc[submission.score] = (acc[submission.score] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([score, count]) => ({
      score: Number(score),
      count,
    }));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'user',
      key: 'user',
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
      title: 'Quiz',
      dataIndex: 'quizName',
      key: 'quizName',
      sorter: (a, b) => a.quizName.localeCompare(b.quizName),
      render: (_, record) => (quizId ? null : record.quizName),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => b.score - a.score,
    },
    {
      title: 'Date',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a, b) => dayjs(b.submittedAt).diff(dayjs(a.submittedAt)),
      render: date => dayjs(date).format('MMMM Do YYYY, h:mm A'),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="submissions-page">
        <HeaderControls
          showBackButton={showBackButton}
          handleBackToQuizzes={() => navigate('/quizzes')}
          handleRefresh={handleRefresh}
          handleShowFilters={handleShowFilters}
          handleShowScoreDistribution={handleShowScoreDistribution}
          handleExportPDF={handleExportPDF}
          handleExportExcel={handleExportExcel}
          totalSubmissions={filteredData.length}
        />
        <FiltersModal
          showFilters={showFilters}
          handleCloseFilters={handleCloseFilters}
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          minScore={minScore}
          setMinScore={setMinScore}
          maxScore={maxScore}
          setMaxScore={setMaxScore}
          selectedQuizName={selectedQuizName}
          handleQuizNameChange={setSelectedQuizName}
          submissions={submissions}
        />
        <ScoreDistributionModal
          showScoreDistribution={showScoreDistribution}
          handleCloseScoreDistribution={handleCloseScoreDistribution}
          distributionEntries={scoreDistribution}
        />
        <SubmissionsTable columns={columns} filteredData={filteredData} />
      </div>
    </Spin>
  );
};

export default Submissions;
