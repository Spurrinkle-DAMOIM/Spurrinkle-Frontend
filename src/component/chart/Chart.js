import ReactApexChart from "react-apexcharts";

function Chart(props){
    const time = props.time;
    time.splice(0, 1);
    const sub = props.sub;
    const chart = {
        series: time, // time
        options: {
            chart: {
                type: 'donut',
            },
            legend: {
                position: 'bottom'
            },
            responsive: [{
                breakpoint: 480,
            }],
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                showAlways: true,
                                show: true,
                                label: 'Total',
                                fontSize: '15px',
                                color: 'black'
                            },
                            value: {
                                fontSize: '22px',
                                show: true,
                                color: 'black',
                            },
                        },
                    }
                }
            },
            labels: sub, // 과목이름
            title: {
                text: '과목통계',
                align: 'center'
            },
        },
    }
    return (
        <>
            <div style={{marginTop:"40px", textAlign:"center"}}>
                <ReactApexChart
                    options={chart.options}
                    series={chart.series}
                    type="donut"
                    height={"auto"}
                />
                <div style={{marginTop:"30px"}}>
                    {
                        props.cal.map((cal, index) => {
                            return(
                                <>
                                    {
                                        index !== 0
                                            ? <h5>{sub[index-1]}: {cal}</h5>
                                            : null
                                    }
                                </>
                            );
                        })
                    }
                </div>
            </div>
        </>
    )
};
export default Chart;