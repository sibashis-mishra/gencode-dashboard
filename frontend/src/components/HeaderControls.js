import React from 'react';
import { Button, Tooltip } from 'antd';
import { ArrowLeftOutlined, FilterOutlined, FileExcelOutlined, FilePdfOutlined, BarChartOutlined, ReloadOutlined } from '@ant-design/icons';

const HeaderControls = ({
  showBackButton,
  handleBackToQuizzes,
  handleRefresh,
  handleShowFilters,
  handleShowScoreDistribution,
  handleExportPDF,
  handleExportExcel,
  totalSubmissions,
}) => (
  <div className="header-controls">
    {showBackButton && (
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={handleBackToQuizzes}
        style={{ marginBottom: 20 }}
      >
        Back to Quizzes
      </Button>
    )}
    <div className="total-submissions">
      Total Submissions: {totalSubmissions}
    </div>
    <div className="action-buttons">
      <Tooltip title="Refresh Data">
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} className="action-button" />
      </Tooltip>
      <Tooltip title="Show Filters">
        <Button icon={<FilterOutlined />} onClick={handleShowFilters} className="action-button" />
      </Tooltip>
      <Tooltip title="Show Score Distribution">
        <Button icon={<BarChartOutlined />} onClick={handleShowScoreDistribution} className="action-button" />
      </Tooltip>
      <Tooltip title="Export to PDF">
        <Button icon={<FilePdfOutlined />} onClick={handleExportPDF} className="action-button" />
      </Tooltip>
      <Tooltip title="Export to Excel">
        <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} className="action-button" />
      </Tooltip>
    </div>
  </div>
);

export default HeaderControls;
