import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ExchangePriceChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const coinGeckoUrl =
    'https://api.coingecko.com/api/v3/coins/cyop-protocol/market_chart?vs_currency=usd&days=30&interval=daily';

  const fetchData = async () => {
    const data: Array<any> = [];

    const res = await fetch(coinGeckoUrl);
    const resData = await res.json();
    for (const item of resData.prices) {
      const date = new Date(item[0]);
      data.push({
        date: format(date, 'MMM d'),
        time: date,
        price: item[1].toFixed(10),
      });
    }
    return data;
  };

  const [latestPrice, setLatestPrice] = useState<any>(0);

  useEffect(() => {
    (async () => {
      const chartData: any = await fetchData();
      setChartData(chartData);
      setLatestPrice(
        parseFloat(chartData[chartData.length - 1].price).toFixed(10)
      );
    })();
  }, []);
  if (!chartData) return null;
  return (
    <>
      <ResponsiveContainer width="100%" maxHeight={300}>
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 15,
            left: 15,
            bottom: 5,
          }}
        >
          <XAxis dataKey="date" hide />
          <YAxis dataKey="price" hide />
          <Tooltip
            formatter={(value: any) => '$ ' + value}
            cursor={false}
            wrapperStyle={{
              background: ' none',
            }}
            labelStyle={{
              fontSize: 10,
            }}
            itemStyle={{
              fontSize: 10,
            }}
            contentStyle={{
              border: '1px solid #05CCB2',
              backgroundColor: 'transparent',
            }}
          />
          <Line type="monotone" dataKey="price" stroke="#05CCB2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ borderTop: '3px solid #05CCB2' }}>
        <div className="pt-2 pb-1">CyOp price tracker</div>
        <div className="pb-1">
          <span className="text-desc">$ {latestPrice}</span>
        </div>
      </div>
    </>
  );
};

export default ExchangePriceChart;
