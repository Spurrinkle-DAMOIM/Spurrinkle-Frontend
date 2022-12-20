import dayjs from "dayjs";

function DateMake(data){

    let date = new Date(data);
    console.log(date);
    let now = new Date();
    if(date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate() && date.getHours() === now.getHours()
        && date.getMinutes() === now.getMinutes()){
        data = "몇 분 전";
    }else{
        if(date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()){
            if(date.getDate() !== now.getDate()){
                const day = now.getDate() - date.getDate();
                if(day === 1){
                    data = "1일 전";
                }else{data = dayjs(date).format("YYYY-MM-DD");}
            }else{  // 날짜도 같을 때
                if(date.getHours() !== now.getHours()){
                    const ho = now.getHours() - date.getHours();
                    data = ho + "시간 전";
                }else if(date.getMinutes() !== now.getMinutes()){
                    const min = now.getMinutes() - date.getMinutes();
                    data = min + "분 전";
                }
            }
        }else{
            data = dayjs(date).format("YYYY-MM-DD");
        }
    }
    return data;
}

export default DateMake;