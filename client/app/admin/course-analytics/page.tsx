"use client"
import { BarChart, Bar, Tooltip, YAxis, XAxis, LabelList } from 'recharts';

export default function CourseAnalytics() {

    const data = [
        {
            name: 'Page A',
            uv: 1,

        },
        {
            name: 'Page B',
            uv: 6,
        },
        {
            name: 'Page C',
            uv: 6
        },
        {
            name: 'Page D',
            uv: 1,
        },
        {
            name: 'Page E',
            uv: 5,

        },
        {
            name: 'Page F',
            uv: 3,

        },
        {
            name: 'Page G',
            uv: 2
        },
    ];
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


            <Bar dataKey="uv" fill="#8884d8">
                <LabelList
                    dataKey="uv"
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