import React, {useCallback, useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route, useParams, useLocation
    // Link
} from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import {Grid, Container} from '@mui/material';
import Board from "./pages/board/Board.js";
import Main from "../src/pages/Main.js";
import Login from "./pages/user/Login.js";
import Join from "./pages/user/Join.js";
import BoardMain from "./pages/board/BoardMain.js";
import ResponsiveAppBar from "./component/ResponsiveAppBar";
import BoardWrite from "./pages/board/BoardWrite.js";
// import TodoTemplate from "./component/todo/TodoTemplate";
import Timer from "./pages/timer/Timer.js";
import Meeting from "./pages/Moim/Meeting.js"
import Timetable from "./pages/Timetable/Timetable.js";
import ProceedingsEdit from "./component/proceedings/ProceedingsEdit.js";
import ChatRoom from "./pages/chatting/ChatRoom";
import CreateMoim from "./pages/Moim/CreateMoim";
import Proceedings from "./component/proceedings/Proceedings.js";
import MeetingStudy from "./component/Moim/MeetingStudy.js";
import MyPageSidebar from './component/sidebar/MyPageSidebar.js';
import UserEdit from "./pages/user/UserEdit.js";
import MeetingApplicationForm from "./pages/Moim/MeetingApplicationForm.js";
import MeetingApplicantList from "./pages/Moim/MeetingApplicantList.js";
import MeetingApplicant from "./pages/Moim/MeetingApplicant.js";
import MeetingCalendar from "./pages/Moim/MeetingCalendar.js";
import TodoTimer from "./pages/mypage/TodoTimer.js";
import MyChattingList from "./pages/mypage/MyChattingList.js";
import Vote from "./pages/Moim/vote/Vote";
import ContestDetail from "./pages/contest/ContestDetail.js";
import MeetingDetail from "./pages/Moim/meetingDetail";
import MoimChatRoom from "./pages/chatting/MoimChatRoom";
import ContestMain from "./pages/contest/ContestMain";
import Calendar from "./component/Calendar.js";
import VoteList from "./pages/Moim/vote/VoteList.js";
import MyBoard from "./pages/mypage/MyBoard.js";
// import PublicReload from "./component/PublicReload";
import SideBar from "./component/sidebar/SideBar.js";
import MeetingEdit from "./pages/Moim/MeetingEdit.js";
import MyMoim from "./pages/mypage/MyMoim.js";
import MoimUserList from "./pages/Moim/MoimUserList.js";
import MeetingNotice from "./pages/Moim/meetingNotice/MeetingNotice.js";
import MeetingNoticeWrite from "./pages/Moim/meetingNotice/MeetingNoticeWrite.js";
import MeetingNoticeDetail from "./pages/Moim/meetingNotice/MeetingNoticeDetail.js";
import PwFind from "./pages/user/PwFind.js";
import IdFind from "./pages/user/IdFind.js";

function App() {
    const [props, setProps] = useState("");
    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});

    //????????? ?????? ??????
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        const id = sessionStorage.getItem("id");
        if (id == null) {
            console.log("isLogin : " + isLogin);
        } else {
            setIsLogin(true);
            console.log("isLogin : " + isLogin);
        }
    });

    const path = window.location.pathname;

    return (
        <>
            <ResponsiveAppBar/>
            <div align={"center"} style={{paddingTop: 30, backgroundColor: "#F4F7FA", paddingBottom: 500}}>
                <Container>
                    <Grid container spacing={1}>
                        {path !== '/login' && path !== '/join' && path !== '/idFind'  && path !== '/pwFind' &&
                            <Grid item xs={3}>
                                <SideBar/>
                            </Grid>
                        }
                        <Grid item xs={path !== '/login' && path !== '/join' && path !== '/idFind' && path !== '/pwFind' ? 9 : 12}>
                            <Router>
                                <Routes>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/join" element={<Join/>}/>
                                    <Route path="/pwFind" element={<PwFind/>}/>
                                    <Route path="/idFind" element={<IdFind/>}/>

                                    <Route path="/" element={<Main/>}/> {/*??????*/}
                                    <Route path="/board/:uni/:id" element={<Board/>}/> {/*??????*/}
                                    <Route path="/board/:id/update" element={<BoardWrite url={"update"}/>}/>{/*??????*/}
                                    <Route path="/boardMain/:uni/:page" element={<BoardMain/>}/>{/*??????*/}
                                    <Route path="/boardMain/:uni" element={<BoardMain/>}/>{/*??????*/}
                                    <Route path="/boardWrite" element={<BoardWrite/>}/>{/*??????*/}
                                    <Route path="/chat/:roomId" element={<ChatRoom/>}/>{/*??????*/}
                                    <Route path="/contest/detail/:name" element={<ContestDetail/>}/> {/*??????*/}
                                    <Route path="/contest/:page" element={<ContestMain/>}/>{/*??????*/}
                                    {/*<Route path="/todo" element={<TodoTemplate/>}/>*/}

                                    <Route path="/myPage" element={<UserEdit forceUpdate={forceUpdate}/>}/>{/*??????*/}
                                    <Route path="/myPage" element={<MyPageSidebar/>}/>{/*??????*/}
                                    <Route path="/myPage/study" element={<TodoTimer/>}/>{/*??????*/}
                                    <Route path="/myPage/timetable" element={<Timetable/>}/>{/*??????*/}
                                    <Route path="/myPage/timer" element={<Timer/>}/>{/*??????*/}
                                    <Route path="/myPage/chatting" element={<MyChattingList/>}/> {/*??????*/}
                                    <Route path="/myPage/chatting/:page" element={<MyChattingList/>}/> {/*??????*/}
                                    <Route path="/myPage/calendar" element={<Calendar/>}/>{/*??????*/}
                                    <Route path="/myPage/myBoard" element={<MyBoard/>}/>{/*??????*/}
                                    <Route path="/myPage/myBoard/:page" element={<MyBoard/>}/>{/*??????*/}
                                    <Route path="/myPage/myMoim" element={<MyMoim/>}/>{/*??????*/}
                                    <Route path="/myPage/myMoim/:page" element={<MyMoim/>}/>{/*??????*/}

                                    {/*<Route path="/myPage/timerCheck" element={<TodoTimer/>}/>*/}

                                    <Route path="/meetings/:page" element={<Meeting/>}/>{/*??????*/}
                                    <Route path="/meetings/createMoim" element={<CreateMoim/>}/>{/*??????*/}

                                    <Route path="/meeting/:meetName/proceeding"
                                           element={<Proceedings meetName={setProps}/>}/> {/*??????*/}
                                    <Route path="/meeting/:meetName/proceeding/:id"
                                           element={<ProceedingsEdit meetName={setProps}/>}/>
                                    <Route path="/meeting/:meetName/study"
                                           element={<MeetingStudy meetName={setProps}/>}/> {/*??????*/}
                                    <Route path="/meeting/:meetName" element={<MeetingDetail meetName={setProps}/>}/> {/*??????*/}
                                    <Route path="/meeting/:meetName/application/" element={<MeetingApplicationForm/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/applicantList/"
                                           element={<MeetingApplicantList meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/chat"
                                           element={<MoimChatRoom meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/applicantList/detail/:userId"
                                           element={<MeetingApplicant/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/calendar" element={<MeetingCalendar/>}
                                           meetName={setProps}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/voteList"
                                           element={<VoteList meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/voteList/:page"
                                           element={<VoteList meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/:voteId" element={<Vote meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/edit" element={<MeetingEdit meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/user"
                                           element={<MoimUserList meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/notice"
                                           element={<MeetingNotice meetName={setProps}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/notice/write"
                                           element={<MeetingNoticeWrite meetName={setProps} url={"write"}/>}/>{/*??????*/}
                                    <Route path="/meeting/:meetName/notice/:annId/update"
                                           element={<MeetingNoticeWrite meetName={setProps} url={"update"}/>}/>{/*??????*/}
                                    {/*MeetingNoticeDetail url??? detail??? ?????? :id??? ????????? ??? ???*/}
                                    <Route path="/meeting/:meetName/notice/:annId"
                                           element={<MeetingNoticeDetail meetName={setProps}/>}/>{/*??????*/}
                                </Routes>
                            </Router>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </>
    );
}

export default App;
