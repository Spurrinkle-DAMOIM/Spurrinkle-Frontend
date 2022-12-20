import React, {Component} from "react";
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import getDate from "../pages/board/BoardDate.js";
import TodoTemplate from "./todo/TodoTemplate.js";
import {Paper} from "@mui/material";
import AppBar from "@mui/material/AppBar";

export default class Calendar extends Component {
    state = {
        calendarEvents: [],
    };

    //일정 삭제
    eventClick = (eventClick) => {
        Alert.fire({
            title: "일정",
            html:
                `<div class="table-responsive">
      <table class="table">
      <tbody>
      <tr >
      <td>제목</td>
      <td><strong>` +
                eventClick.event.title +
                `</strong></td>
      </tr>
      <tr >
      <td>시작 시간</td>
      <td><strong>
      ` +
                eventClick.event.start +
                `
      </strong></td>
      </tr>
      <tr >
      <td>종료 시간</td>
      <td><strong>
      ` +
                eventClick.event.end +
                `
      </strong></td>
      </tr>
      </tbody>
      </table>
      </div>`,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "닫기"
        }).then((result) => {
            if (result.value) {
                const list = [];
                const title = eventClick.event.title;
                const start = eventClick.event.start;
                const end = eventClick.event.end;
                const obj = {
                    id: eventClick.event.id,
                    title: title,
                    start: start,
                    end: end
                }
                list.push(obj);
                axios.post(`/myPage/calendar/remove`, {
                    user: sessionStorage.getItem('id'),
                    days: list
                })
                    .then((res) => {
                        eventClick.event.remove(); // It will remove event from the calendar
                        Alert.fire({
                            title: "삭제 완료",
                            html: "성공적으로 삭제되었습니다r",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        })
                    })
                    .catch((err) => {
                        console.log("에러 : ", err);
                    })
            }
        });
    };

    //일정 추가
    eventAdd = (eventAdd) => {
        Alert.fire({
            title: "일정 추가",
            html:
                `<div class="table-responsive">
      <table class="table">
      <tbody>
      <tr >
      <td>할 일</td>
      <td><input type="text" id="calTitle" maxlength="15"></td>
      </tr>
      <tr >
      <td>시작 시간</td>
      <td><input type="datetime-local" id="calStart" maxlength="15"></td>
      </tr>
      <tr >
      <td>종료 시간</td>
      <td><input type="datetime-local" id="calEnd" maxlength="15"></td>
      </tr>
      </tbody>
      </table>
      </div>`,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "확인",
            cancelButtonText: "닫기",
        }).then((result) => {
            const user = sessionStorage.getItem('id');
            const inputtitle = document.getElementById("calTitle").value;
            const inputstart = document.getElementById("calStart").value;
            const inputend = document.getElementById("calEnd").value;
            if (result.value) {
                if (inputtitle === "" || inputstart === "" || inputend === "") {
                    Alert.fire({
                        html: "빈칸을 채워주세요",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                } else {
                    const list = [];
                    const obj = {
                        title: inputtitle,
                        start: inputstart,
                        end: inputend,
                    };
                    list.push(obj);
                    axios.post(`/myPage/calendar/add`,
                        {
                            user: user,
                            days: list,
                        })
                        .then((res) => {
                            this.state.calendarEvents = res.data.days;
                            Alert.fire({
                                html: "성공적으로 추가되었습니다",
                                icon: "success",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            }).then((res)=>{
                                this.forceUpdate();
                            });
                        }).catch((err) => {
                        console.log("에러 : " + err);
                    })
                }
            }
        });
    };

    componentDidMount() {
        axios.post(`/myPage/calendar`, {
            user: sessionStorage.getItem('id')
        })
            .then((res) => {
                    if (res.data !== null) {
                        this.state.calendarEvents = res.data.days;
                        this.forceUpdate();
                    } else {

                    }
                }
            );
    }

    render() {
        return (
            <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "828px", height:"auto" }}>
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor:"#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>캘린더</div>
                </AppBar>
            <div className="animated fadeIn p-4 demo-app">
                <div className="demo-app-calendar" id="mycalendartest" style={{paddingTop:10}}>
                    <FullCalendar
                        defaultView="dayGridMonth"
                        rerenderDelay={10}
                        eventDurationEditable={false}
                        editable={false}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        events={this.state.calendarEvents}
                        dateClick={this.eventAdd}
                        eventReceive={this.eventReceive}
                        eventClick={(eventClick) => {this.eventClick(eventClick)}}
                        fixedWeekCount={false}
                        eventLimit={true}
                        views={{
                            dayGrid: {
                                eventLimit: 5,
                            }
                        }}
                        locale='ko'
                    />
                </div>
            </div>
            </Paper>
        );
    }
}