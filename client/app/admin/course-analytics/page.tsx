"use client"
import { useEffect, useState } from 'react';
import { BarChart, Bar, Tooltip, YAxis, XAxis, LabelList } from 'recharts';
import authApi from '../../../api/AuthApi';
import routes from '../../../routes';

export default function CourseAnalytics() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
console.log("here is data",data)
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await authApi.getUsersAnalytics(routes.getUsersAnalytics);
                console.log("response",response)
                setData(response.months || response || []);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className='flex w-full justify-center items-center h-screen'>
            <div className='text-xl text-gray-400'>Loading analytics...</div>
        </div>;
    }

    return <div className='flex   w-full justify-center items-center'>
        <BarChart
            style={{
                width: '100%', maxWidth: '1000px', maxHeight: '500px', aspectRatio: 1.618,
            }}
            responsive
            data={data}
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


            <Bar dataKey="count" fill="#8884d8">
                <LabelList
                    dataKey="count"
                    position="top"        /* Places text directly above the bar */
                    offset={5}           /* Adds 5px space between bar top and text */
                    fill="#333"          /* Text color */
                    fontSize={11}        /* Text size */
                    fontWeight="bold"
                />

            </Bar>
        </BarChart>
    </div>
}