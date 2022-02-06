import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { styled } from '@mui/system';
import React from 'react';

const ChartDiv = styled('div')(({ theme }) => ({
  height: 500,

  [theme.breakpoints.down('sm')]: {
    height: 400,
  },
  [theme.breakpoints.down('xs')]: {
    height: 300,
  },
}));

const ChartComponent = ({ data, options }: Props) => (
  <ChartDiv>
    <Line height={400} data={data} options={options} />
  </ChartDiv>
);

interface Props {
  data;
  options;
}

export default React.memo(ChartComponent);
