import React from 'react';
import { Modal } from 'antd';
import { PieChart, Pie, Tooltip as RechartsTooltip, Cell } from 'recharts';

const ScoreDistributionModal = ({
  showScoreDistribution,
  handleCloseScoreDistribution,
  distributionEntries,
}) => (
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
);

export default ScoreDistributionModal;
