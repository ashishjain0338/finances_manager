import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useEffect, useState } from 'react';
import { getBackgroundColor } from '../../scripts/utils';
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const dummyData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
        {
            label: 'My Dataset',
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            borderWidth: 1,
        },
    ],
};


function MyDoughnut(props) {
    const [data, setData] = useState(dummyData)
    const [title, setTitle] = useState(props.title)// Title will not change on runtime


    useEffect(() => {
        var cur = props.plotData
        setData(
            {
                labels: cur[0],
                datasets: [
                    {
                        label: "Something",
                        data: cur[1],
                        backgroundColor: getBackgroundColor(cur[1].length),
                        borderWidth: 1,
                    }
                ]
            }
        )

    }, [props.plotData])


    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right', // top / bottom / left / right
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 18,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var tot = 0;
                        for (var i = 0; i < context.dataset['data'].length; i++)
                            tot += context.dataset['data'][i]
                        var value = context['parsed'];
                        var percentage = value / tot * 100;
                        percentage = Math.round(percentage * 10) / 10
                        var out = `${value} (${percentage}%)`
                        return out;
                    }
                }
            },
        },
    };

    return (
        <div>
            <Doughnut data={data} options={options} />
        </div>
    )
}

export { MyDoughnut }