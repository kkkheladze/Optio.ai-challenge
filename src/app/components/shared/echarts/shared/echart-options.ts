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
export { DoughnutOptions };
