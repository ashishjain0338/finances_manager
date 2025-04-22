import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useEffect, useState } from 'react';
import { getBackgroundColor, convertToIndiaCommaNotationFxn } from '../../scripts/utils';
import { DUMMY_DOUGHTNUT_DATA } from '../../scripts/constant';
ChartJS.register(ArcElement, Tooltip, Legend, Title);




function MyDoughnut(props) {
    const [data, setData] = useState(DUMMY_DOUGHTNUT_DATA)
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
                labels: {
                    filter: function (legendItem, chartData) {
                        return chartData.labels.indexOf(legendItem.text) < 12; // Show only the first 10 legends
                    }
                },
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
                        var valueWithIndianCommaNotation = convertToIndiaCommaNotationFxn(value)
                        var out = `${valueWithIndianCommaNotation} (${percentage}%)`
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