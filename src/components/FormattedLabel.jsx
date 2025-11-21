import React from 'react';

const FormattedLabel = ({ value }) => {
  if (value === undefined || value === null || value === '') {
    return <span className="text-gray-400">Not set</span>;
  }
  return <span className="text-gray-200">{value}</span>;
};

export default FormattedLabel;
