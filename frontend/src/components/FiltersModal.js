import React from 'react';
import { Modal, Input, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FiltersModal = ({
  showFilters,
  handleCloseFilters,
  searchText,
  setSearchText,
  dateRange,
  setDateRange,
  minScore,
  setMinScore,
  maxScore,
  setMaxScore,
  selectedQuizName,
  handleQuizNameChange,
  submissions,
}) => (
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
);

export default FiltersModal;
