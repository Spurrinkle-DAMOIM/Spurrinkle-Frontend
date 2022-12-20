import React from "react";

function Time(props){
    const hours = props.hours;
    const minutes = props.minutes;
    const seconds = props.seconds;
    if(props.type === "div"){
        return(
            <>
                <div>{hours < 10 ? `0${hours}` : hours}
                    : {minutes < 10 ? `0${minutes}` : minutes}
                    : {seconds < 10 ? `0${seconds}` : seconds}
                </div>
            </>
        );
    }else if(props.type === "h1"){
        return(
            <>
                <h1>{hours < 10 ? `0${hours}` : hours}
                    : {minutes < 10 ? `0${minutes}` : minutes}
                    : {seconds < 10 ? `0${seconds}` : seconds}
                </h1>
            </>
        );
    }
}
export default Time;