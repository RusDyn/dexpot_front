import { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { Chart, LineElement } from 'chart.js';
Chart.register(LineElement);

import ChartComponent from '../../src/components/chart';

export const callApi = async (url: string) => {
  const fullUrl = `${API_URL}/${url}`;
  const res = await fetch(fullUrl, {});
  const text = await res.text();
  const result = JSON.parse(text);
  return result;
};

const Account: NextPage<{}> = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState<any>(undefined);
  const [data2, setData2] = useState<any>({
    balance: 0,
    return: 0,
    dates: { first: 0, last: 0 },
  });

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
      x: {
        type: 'time',
        time: {
          stepSize: 1,
          unit: 'day',
          tooltipFormat: 'MM/dd/yyyy',
        },
        ticks: {
          display: true,
          callback: function (value) {
            return value;
            /*
            return intl.formatDate(parse(value, 'MMM dd', new Date()), {
              month: 'short',
              day: 'numeric',
            });*/
          },
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
    },
  });

  const maxChartItems = 600;

  const filterChartForMaxItems = (items: any[]) => {
    const len = items.length;

    if (items.length > maxChartItems) {
      const eachNth = Math.ceil(len / maxChartItems);
      items = items.filter(
        (item, index) => index == 0 || index == len - 1 || index % eachNth == 0
      );
    }
    return items;
  };

  const loadData = async () => {
    const id = (slug || [])[0];
    if (id) {
      const result = await callApi(`history/${id}`);
      const { balances, changes, dates, data } = result;
      setData2(data);
      const labels = dates.map((item) => new Date(item));

      const changes2: number[] = [];
      if (changes.length > 0) {
        let lastY = 0;
        changes2.push(0);

        for (let i = 1; i < changes.length; i++) {
          const y = changes[i];
          lastY = (1 + lastY) * (1 + y) - 1;
          changes2.push(lastY * 100);
        }
      }

      const datasets = [
        {
          label: 'balance',
          showLine: true,
          fill: true,
          borderColor: 'rgba(255, 99, 132, 1)',
          yAxisID: 'A',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: 'transparent',
          pointBorderWidth: 1,
          pointRadius: 0,
          pointHitRadius: 3,
          pointBorderColor: 'rgba(255, 99, 132, 1)',
          pointHoverBorderWidth: 2,
          pointHoverRadius: 5,
          lineTension: 0.2,
          data: filterChartForMaxItems(balances),
          order: 2,
        },
        {
          label: 'return',
          yAxisID: 'B',
          borderWidth: 3,
          order: 1,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0)',
          type: 'line',
          pointBackgroundColor: 'transparent',
          pointBorderWidth: 1,
          pointHitRadius: 3,
          pointRadius: 0,
          pointBorderColor: 'rgba(54, 162, 235, 1)',
          pointHoverBorderWidth: 2,
          pointHoverRadius: 5,
          lineTension: 0.2,
          data: filterChartForMaxItems(changes2),
        },
      ];
      setData({ labels: filterChartForMaxItems(labels), datasets });
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const { balance, dates, profit } = data2;
  const { first, last } = dates;

  return (
    <main>
      <div>
        {data && (
          <>
            <ChartComponent data={data} options={optionsRef.current} />
            <Typography>{`Balance: ${balance}`}</Typography>
            <Typography>{`Profit: ${(profit * 100).toFixed(2)}%`}</Typography>
            {first && (
              <Typography>{`First: ${new Date(
                first
              ).toISOString()}`}</Typography>
            )}
            {last && (
              <Typography>{`First: ${new Date(
                last
              ).toISOString()}`}</Typography>
            )}
          </>
        )}
        {!data && (
          <Typography variant={'h6'} align={'center'}>
            Loading
          </Typography>
        )}
      </div>
    </main>
  );
};

export default Account;
