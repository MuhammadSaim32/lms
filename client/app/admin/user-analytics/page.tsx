"use client"
import { Area, AreaChart, XAxis, YAxis, Tooltip } from 'recharts';

// #region Sample data
const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

// #endregion
const TinyAreaChart = () => {
    return (
        <div className='flex   w-full justify-center items-center'>

            <AreaChart
                style={{
                    width: '100%', maxWidth: '1000px', maxHeight: '500px', aspectRatio: 1.618,
                }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >

                <YAxis
                    domain={[0, 8]} /* Enforces Y min of 0 and Y max of 1000 */
                    hide={false}        /* Keeps layout tiny by hiding labels and lines */
                />
                <XAxis
                    domain={[0, 8]} /* Enforces Y min of 0 and Y max of 1000 */
                    hide={false}        /* Keeps layout tiny by hiding labels and lines */
                />
                <Tooltip
                />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
    );
};

export default TinyAreaChart;