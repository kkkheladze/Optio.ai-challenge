const DoughnutOptions: any = {
    tooltip: {
        trigger: 'item',
    },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
};
const HeatmapOptions: any = {
    tooltip: {
        position: 'top',
    },
    grid: {
        height: '50%',
        top: '10%',
    },
    xAxis: {
        show: true,
        type: 'category',
        data: ['Week 1', ' Week 2', 'Week 3', 'Week 4', 'Week 5'],
        splitArea: {
            show: true,
        },
    },
    yAxis: {
        type: 'category',
        data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        splitArea: {
            show: true,
        },
    },
    visualMap: {
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
    },
    series: [
        {
            type: 'heatmap',
            data: [0, 0, '-'],
            label: {
                show: true,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
};
export { DoughnutOptions, HeatmapOptions };
const date = new Date('2018-01-31T00:00:00.000Z');
date.getDay();