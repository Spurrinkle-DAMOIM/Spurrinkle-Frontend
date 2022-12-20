import dayjs from "dayjs";

function getDate(data){
    for(var i = 0; i < data.length; i++){
        if(data[i].reReply !== undefined && data[i].reReply.length > 0){
            data[i].reReply = getDate(data[i].reReply);
        }
        let date = new Date(data[i].date);
        console.log(date);
        let now = new Date();
        if(date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
            && date.getDate() === now.getDate() && date.getHours() === now.getHours()
            && date.getMinutes() === now.getMinutes()){
            data[i].date = "몇 분 전";
        }else{
            if(date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()){
                if(date.getDate() !== now.getDate()){
                    const day = now.getDate() - date.getDate();
                    if(day === 1){
                        data[i].date = "1일 전";
                    }else{data[i].date = dayjs(date).format("YYYY-MM-DD");}
                }else{  // 날짜도 같을 때
                    if(date.getHours() !== now.getHours()){
                        const ho = now.getHours() - date.getHours();
                        data[i].date = ho + "시간 전";
                    }else if(date.getMinutes() !== now.getMinutes()){
                        const min = now.getMinutes() - date.getMinutes();
                        data[i].date = min + "분 전";
                    }
                }
            }else{
                data[i].date = dayjs(date).format("YYYY-MM-DD");
            }
        }
    }
    return data;
}

export default getDate;