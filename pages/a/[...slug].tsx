import { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from 'next/router';
import Chart from '../../src/components/chart';
import { Typography } from '@mui/material';

const Account: NextPage<{}> = () => {

  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState(undefined);

  const optionsRef = useRef({
    plugins: {
      tooltip: {
        caretPadding: 20,
        caretSize: 10,
        enabled: true,
        intersect: false,
        mode: 'index',
        padding: {
          x: 10,
          y: 20,
        },
        borderWidth: 1,
        borderColor: 'white',
        callbacks: {
          label: function (data) {
            const { datasetIndex, dataset, formattedValue, raw } = data;
            const { label = '' } = dataset;

            let result = '';
            if (label) {
              result = `${label}: `;
            }

            if (datasetIndex === 1) {
              result += Math.round(raw * 100) / 100;
              result += '%';
            } else {
              result += formattedValue;
            }

            return result;
          },
          labelColor: function (tooltipItem) {
            const items = [
              {
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 1)',
              },

              {
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 1)',
              },
              {
                borderColor: '#f57f17',
                backgroundColor: '#f57f17',
              },
              {
                borderColor: '#85bb65',
                backgroundColor: '#85bb65',
              },
              {
                borderColor: 'rgba(133, 187, 101, 0.8)',
                backgroundColor: 'rgba(133, 187, 101, 0.8)',
              },
              {
                borderColor: 'rgba(133, 187, 101, 0.8)',
                backgroundColor: 'rgba(133, 187, 101, 0.8)',
              },
            ];
            return items[tooltipItem.datasetIndex];
          },
        },
      },
      legend: {
        display: true,
        onClick: function (e, legendItem) {
          const index = legendItem.datasetIndex;
          // @ts-ignore
          const ci = this.chart;
          const meta = ci.getDatasetMeta(index);

          // See controller.isDatasetVisible comment
          meta.hidden =
            meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          // We hid a dataset ... rerender the chart
          ci.update();
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    onClick: function () {},
    title: {
      display: false,
      text: 'Custom Chart Title',
    },

    hover: {
      mode: 'index',
      axis: 'x',
      intersect: false,
      animationDuration: 0,
    },
    scales: {
      A: {
        type: 'linear',
        position: 'left',
        title: {
          display: false,
          labelString: 'balance',
          color: 'rgba(255, 99, 132, 1)',
          fontSize: 16,
          lineHeight: 0.5,
        },
        ticks: {
          color: 'rgba(255, 99, 132, 1)',
          callback: function (value) {
            return parseFloat(value.toFixed(8));
          },
        },
      },
      B: {
        type: 'linear',
        position: 'right',
        offset: false,
        title: {
          display: false,
          labelString: 'return',
          color: 'rgba(54, 162, 235, 1)',
          fontSize: 16,
          lineHeight: 0.5,
        },
        ticks: {
          callback: function (value) {
            return `${parseFloat(value.toFixed(2))}%`;
          },
          color: 'rgba(54, 162, 235, 1)',
        },
      },
    },
  });

  const loadData = async () => {
    const id = (slug || [])[0];
    if (id) {
      const fullUrl = API_URL + '/history/' + id;
      const res = await fetch(fullUrl, {});
      const text = await res.text();
      const data = JSON.parse(text);
      console.log(data)
    }
  }

  useEffect(() => {
    loadData()
  }, [slug])


  return <main>
    <div>
      {data && <Chart data={data} options={optionsRef.current} />}
      {!data && <Typography variant={'h6'} align={'center'}>
        Loading
      </Typography>}
    </div>
  </main>
};

export default Account;