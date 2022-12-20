import "../../css/sidebar/sidebar.css";
import SidebarLink from "./SidebarLink";
import SidebarLinkRelated from "./SidebarLinkRelated";
import Paper from "@mui/material/Paper";
import {BadgeCompo, LinkBar} from "./barLink/LinkBar";
import React, {useState} from 'react';
import MeetingSidebar from "../Moim/MeetingSidebar.js";
import MyPageSidebar from "./MyPageSidebar.js";
import axios from "axios";
import Profile from "../profile/Profile.js";

function Sidebar() {
    const decodeUri = decodeURI(window.location.pathname);
    const name = decodeUri.split("/")[1];
    const [isShown, setIsShown] = useState(false);

    if (name === "meeting") {
        const path = decodeUri.split("/")[2];

        axios.get(`/Moim/${path}/moimDetail`)
            .then(res => {
                if (!res.data.user.includes(sessionStorage.getItem("id"))) {
                    setIsShown(true);
                } else {
                    setIsShown(false);
                }
            });

        if (isShown === true) {
            return (
                <>
                    <div align={"center"}>
                        <Profile/>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div align={"center"}>
                        <Profile/>
                        <div style={{paddingTop: 10}}>
                            <MeetingSidebar/>
                        </div>
                    </div>
                </>
            );
        }
    } else if (name === "myPage") {
        return (
            <>
                <div align={"center"}>
                    <Profile/>
                    <div style={{paddingTop: 10}}>
                        <MyPageSidebar/>
                    </div>
                </div>
            </>
        );
    } else if (name === "login" || name === "join" || name === "pwFind") {
        return (
            <>
            </>
        );
    } else {
        return (
            <>
                <div align={"center"}>
                    <Profile/>
                </div>
            </>
        )
    }
}

export default Sidebar;