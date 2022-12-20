import styled from "styled-components";
import { faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import SubModal from "../../component/Modal.js";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
function Timetable(){
    const [popup, setPopup] = useState({open: false, title: "", message: "", callback: false});
    const [datas, setDatas] = useState([]);
    const week = ["구분", "월", "화", "수", "목", "금"];
    const weekArr = ["월", "화", "수", "목", "금"];
    const arr = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const timeArr = ["09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const onClickAddSub = () => {
        setPopup({
            open: true,
            title: "수업 등록",
        });
    }
    const getData = async (id) => {
        let date = new Date();
        if(date.getMonth()+1 < 9){
            date = date.getFullYear() + "-1";
        }else{
            date = date.getFullYear() + "-2";
        }
        console.log(date);
        await axios.get(`/timeTable/${id}/${date}/searchSemester`)
            .then(async (res) => {
                if (res.data !== "fail") {
                    console.log("과목 정보: ", res.data);
                    await getTime(res.data);
                }
            });
    }
    const getTime = async (data) => {
        for(var i = 0; i < data.length; i++) {
            const obj = {
                days: data[i].days,
            };
            await axios.post(`/timeTable/searchTime`, obj)
                .then((res) => {
                    if (res.data !== "fail") {
                        data[i].days = res.data;
                    }
                });
        }
        setDatas(data);
    }
    useEffect(() => {
        const id = sessionStorage.getItem("id");
        if(id != null){
            getData(id);
        }
    }, []);
    return(
        <>
            <SubModal open = {popup.open} setPopup = {setPopup} title = {popup.title} callback = {popup.callback}/>
            <TimeDiv>
                <TimeH3>시간표</TimeH3>
                <IconButton style={{marginTop:"24px",width:"40px", height:"40px"}}
                            onClick={onClickAddSub}
                >
                    <FontAwesomeIcon icon={faPlus}/>
                </IconButton>
            </TimeDiv>
            <TimeTable>
                <TimeTr>
                    {
                        week.map(w => {
                            return(
                                <TimeTd>{w}</TimeTd>
                            );
                        })
                    }
                </TimeTr>
                {
                    arr.map((a, aIndex) => {
                        return(
                            <>
                                <TimeTr>
                                    <TimeTd>{a}</TimeTd>
                                    {
                                        weekArr.map((w, wIndex) => {
                                            let boo = false;
                                            let endCheck;
                                            const idx = [];
                                            datas.map((d, idx1) => {
                                                d.days.map((day, idx2) => {
                                                    const start = day.start.split(':')[0];
                                                    const end = day.end.split(':')[0];
                                                    const time = String(a).length < 2 ? "0"+a : a;

                                                    const start2 = start[0] === "0" ? start[1] : start;
                                                    const end2 = end[0] === "0" ? end[1] : end;
                                                    return(<>
                                                        {
                                                            day.day === w && start === time
                                                                ? <>
                                                                    {console.log("맞다구영", datas[idx1].subName)}
                                                                    <TimeColorTd>
                                                                        <div>{datas[idx1].subName}</div>
                                                                        <div>{datas[idx1].place}</div>
                                                                    </TimeColorTd>
                                                                </>
                                                                : boo = true
                                                        }
                                                    </>)
                                                    // if(day.day === w && start === time){
                                                    //     return(<>
                                                    //         <TimeColorTd>
                                                    //             {datas[idx1] !== undefined
                                                    //                 ? <>
                                                    //                     <div>{datas[idx1].subName}</div>
                                                    //                     <div>{datas[idx1].place}</div>
                                                    //                 </>
                                                    //                 : null}
                                                    //         </TimeColorTd>
                                                    //     </>)
                                                    // }
                                                    // return(<>
                                                    //     {
                                                    //         day.day === w && start === time
                                                    //             ? <>{idx.push(idx1)}
                                                    //                 {idx.push(idx2)}
                                                    //                 {endCheck = Number(end2) - Number(start2)}</>
                                                    //             : <>{boo = true}</>
                                                    //     }
                                                    // </>);
                                                })
                                            })
                                            // endCheck--;
                                            // return(<>
                                            //     {
                                            //         boo === true
                                            //             ? (
                                            //                 endCheck !== undefined && !isNaN(endCheck) && endCheck >=0
                                            //                 ? <TimeColorTd>
                                            //                         {datas[idx[0]] !== undefined
                                            //                             ? <>
                                            //                                 <div>{datas[idx[0]].subName}</div>
                                            //                                 <div>{datas[idx[0]].place}</div>
                                            //                             </>
                                            //                             : null}
                                            //                     </TimeColorTd>
                                            //                 : <TimeTd>a</TimeTd>
                                            //             )
                                            //             : <TimeColorTd>
                                            //                 {datas[idx[0]] !== undefined
                                            //                     ? <>
                                            //                         <div>{datas[idx[0]].subName}</div>
                                            //                         <div>{datas[idx[0]].place}</div>
                                            //                     </>
                                            //                     : null}
                                            //             </TimeColorTd>
                                            //     }
                                            // </>);
                                        })
                                    }
                                </TimeTr>
                            </>
                        );
                    })
                }
            </TimeTable>
        </>
    );
}
export default Timetable;

let TimeTable = styled.table` 
    border: 1px solid #444444;
    width: 600px;
    height: 600px;
    margin-top: 40px;
`
let TimeTr = styled.tr`
    border: 1px solid #444444;
`
let TimeTd = styled.td`
    border: 1px solid #444444;
    width: 80px;
    text-align: center;
`
let TimeColorTd = styled.td`
    border: 1px solid #444444;
    width: 80px;
    text-align: center;
    background-color: red;
`
let TimeH3 = styled.h3`
    margin-top: 30px;
`
let TimeDiv = styled.div`
    display: flex;
`