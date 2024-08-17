import React from 'react';
import { Table } from 'antd';

const SubmissionsTable = ({ columns, filteredData }) => (
  <Table
    columns={columns}
    dataSource={filteredData}
    rowKey="id"
    pagination={true}
  />
);

export default SubmissionsTable;
