import ReactApexChart from "react-apexcharts";

function BarChart(props){
    const sub = props.sub;
    console.log(sub);
    const arr2 = Array.from({length: 24}, (v, i) => i+1);
    var arr = new Array(24).fill(0);
    const chart = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: arr2
            }
        },
        series: [
            {
                name: "공부시간(S)",
                data: arr
            }
        ]
    }
    for(var i = 0; i < arr2.length; i++) {
        for(var j = 0; j < sub.length; j++) {
            const hour = sub[j].hour.length == 2 ? sub[j].hour : "0" + sub[j].hour;
            if(hour === String(arr2[i])){
                arr[i] = sub[j].time;
                break;
            }
        }
        arr2[i] += "시";
    }
    return (
        <>
            <div style={{marginTop:"40px", textAlign:"center"}}>
                <div style={{margin: "0 auto"}}>
                    <ReactApexChart
                        options={chart.options}
                        series={chart.series}
                        type="bar"
                        width={"100%"}
                    />
                </div>
            </div>
        </>
    )
};
export default BarChart;