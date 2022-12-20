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
import {withRouter} from "react-router";
import {useParams} from "react-router-dom";
import {Paper} from "@mui/material";
import AppBar from "@mui/material/AppBar";

let meetName = decodeURI(window.location.href.split("/")[4]);
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
                    user: meetName,
                    days: list
                })
                    .then((res) => {
                        eventClick.event.remove(); // It will remove event from the calendar
                        Alert.fire({
                            title: "삭제 완료",
                            html: "성공적으로 삭제되었습니다",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        });
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
                    });
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
                            user: meetName,
                            days: list,
                        })
                        .then((res) => {
                            this.state.calendarEvents = res.data.days;
                            Alert.fire({
                                html: "성공적으로 추가되었습니다",
                                icon: "success",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            }).then((res) => {
                                this.forceUpdate();
                            });
                        }).catch((err) => {
                        console.log("에러 : " + err);
                    })
                }
            }
        });
    };

    //회의록 표기
    eventCheck = (eventClick) => {
        const list = [];
        const obj = {
            id: eventClick.event.id
        }
        list.push(obj);
        axios.post(`/meeting/proceedings`, {
            user: meetName,
            days: list
        })
            .then((res) => {
                console.log(res.data);
                Alert.fire({
                    width: "900px",
                    html:
                        `<div class="table-responsive">
      <table class="table">
      <tbody>
      <tr>
      <td></td>
      <td> ` +
                        res.data.days[0].content +
                        `
                        </td>
</tr>
      </tbody>
      </table>
      </div>`,
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonColor: "#d33",
                    denyButtonColor: "#8FBC8F",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "삭제",
                    denyButtonText: "수정",
                    cancelButtonText: "닫기"
                }).then((result) => {
                    if (result.isConfirmed === true) {
                        const list = [];
                        const title = eventClick.event.title;
                        const obj = {
                            id: eventClick.event.id,
                        }
                        list.push(obj);
                        axios.post(`/myPage/calendar/remove`, {
                            user: meetName,
                            days: list
                        })
                            .then((res) => {
                                eventClick.event.remove(); // It will remove event from the calendar
                                Alert.fire({
                                    title: "삭제 완료",
                                    html: "성공적으로 삭제되었습니다",
                                    icon: "success",
                                    confirmButtonColor: "#1976D2",
                                    confirmButtonText: "확인"
                                });
                            })
                    } else if (result.isDenied === true) {
                        window.location.href = `/meeting/${meetName}/proceeding/${res.data.days[0].id}`;
                    }
                })
            })
            .catch((err) => {
                console.log("에러 : ", err);
            })
    }

    componentDidMount() {
        meetName = decodeURI(window.location.href.split("/")[4]);
        axios.post(`/myPage/calendar`, {
            user: meetName
        })
            .then((res) => {
                    if (res.data !== '') {
                        this.state.calendarEvents = res.data.days;
                        this.forceUpdate();
                    } else {
                    }
                }
            )
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        // const meetName = decodeURI(window.location.href.split("/")[4]);
        // const { location, history } = this.props;
        // const { meetName } = this.props.match.params.meetName;
        return (
            <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "820px"}}>
                {/*<React.Fragment>meetName : {location.pathname}</React.Fragment>*/}
                {/*<div> meetName : {meetName} </div>*/}
                {/*<div> meetName : {location.pathname} </div>*/}
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor: "#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                ><div align={"left"} style={{paddingLeft:"20px", margin:"18px", fontSize:"30px", fontWeight:"bold"}}>{meetName} 캘린더</div></AppBar>
                <div style={{ margin:"30px"}}>
                <FullCalendar
                    defaultView="dayGridMonth"
                    rerenderDelay={10}
                    eventDurationEditable={false}
                    editable={false}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    events={this.state.calendarEvents}
                    dateClick={this.eventAdd}
                    eventReceive={this.eventReceive}
                    eventClick={(eventClick) => {
                        eventClick.event.title === "회의록" && eventClick.event.end === null ? this.eventCheck(eventClick) : this.eventClick(eventClick)
                    }}
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
            </Paper>
        )
    }
};