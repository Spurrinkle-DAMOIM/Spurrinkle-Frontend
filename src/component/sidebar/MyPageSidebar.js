import React, {useState} from 'react';
import axios from "axios";
import "../../css/sidebar/sidebar.css";
import SidebarLink from "./SidebarLink";
import SidebarLinkRelated from "./SidebarLinkRelated";
import {Paper} from "@mui/material";

function Sidebar() {
    return (
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"au"}}>
            <div className="sidebar">
                <SidebarLink text="계정"/>
                <a href='/myPage' style={{color: "#000000", textDecorationLine: "none"}}>
                    <SidebarLinkRelated text=" - 개인정보 변경"/></a>
                <SidebarLink text="게시판"/>
                <a href='/myPage/myBoard' style={{color: "#000000", textDecorationLine: "none"}}><SidebarLinkRelated
                    text=" - 작성한 게시물"/></a>
                <SidebarLink text="모임"/>
                <a href='/myPage/myMoim' style={{color: "#000000", textDecorationLine: "none"}}><SidebarLinkRelated text=" - 나의 모임 관리"/></a>
                <SidebarLink text="일정"/>
                <a href='/myPage/calendar' style={{color: "#000000", textDecorationLine: "none"}}><SidebarLinkRelated text=" - 캘린더"/></a>
                <SidebarLink text="스터디"/>
                <a href='/myPage/timer' style={{color: "#000000", textDecorationLine: "none"}}><SidebarLinkRelated text=" - 타이머"/></a>
                <a href='/myPage/study' style={{color: "#000000", textDecorationLine: "none"}}><SidebarLinkRelated text=" - To-do/스터디 통계"/></a>
                <SidebarLink text="채팅"/>
                <a href='/myPage/chatting' style={{color: "#000000", textDecorationLine: "none"}}><SidebarLinkRelated text=" - 채팅 목록"/></a>
            </div>
        </Paper>
    );
}

export default Sidebar;