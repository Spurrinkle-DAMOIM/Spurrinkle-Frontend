import React, {useEffect, useState} from 'react';
import axios from "axios";
import "../../css/sidebar/sidebar.css";
import SidebarLink from "../sidebar/SidebarLink.js";
import SidebarLinkRelated from "../sidebar/SidebarLinkRelated";
import {Paper, Badge, styled} from "@mui/material";
import {BadgeCompo, LinkBar} from "../sidebar/barLink/LinkBar.js";
import Alert from "sweetalert2";

function MeetingSidebar(props){
    const location = window.location.href;
    const name = decodeURI(location.split("/")[4]);
    const id = sessionStorage.getItem("id");
    const [data, setData] = useState({});

    const getData = async (name) => {
        let data;
        await axios.get(`/Moim/${name}/moimDetail`)
            .then(res => {
                setData(res.data);
                data =  res.data;
            })
            .catch(error => console.log(error))

        return data;
    }

    useEffect(()=>{
        if(name !== ""){getData(name);}
    },[name])

    const chat =()=>{
        window.location.href =`/meeting/${name}/chat`
    }

    let [root, setRoot] = useState('');

    const cal = () => {
        window.location.href = `/meeting/${name}/calendar`
        setRoot(window.location.href);
    }
    const notice = () => {
        window.location.href = `/meeting/${name}/notice`
        setRoot(window.location.href);
    }

    const deleteMoim = async () => {
        await axios.get(`/Moim/${name}/delete`)
            .then(res => {
                Alert.fire({
                    html: "해당 모임이 정상적으로 삭제되었습니다",
                    icon: "success",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                }).then((res) => {
                    window.location.href = `/meetings/1`;
                });
            })
            .catch(error => console.log(error))
    }
    const checkUserList = async (name, url) => {
        console.log("유저 체크: ", data);
        // 슬라이드바 모임 가입자만 이용 가능하도록 하기
        if (!data.user.includes(id)) {
            Alert.fire({
                html: "모임 가입자만 이용하실 수 있습니다",
                icon: "error",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (url === "회의록") {
            window.location.href = `/meeting/${name}/proceeding`
        } else if (url === "공부") {
            window.location.href = `/meeting/${name}/study`
        } else if (url === "신청자") {
            if (data.leader !== id) {
                Alert.fire({
                    html: "모임장만 확인하실 수 있습니다",
                    icon: "error",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                });
                return;
            }
            window.location.href = `/meeting/${name}/applicantList`
        } else if (url === "투표") {
            window.location.href = `/meeting/${name}/voteList`
        } else if (url === "채팅") {
            window.location.href = `/meeting/${name}/chat`
        } else if (url === "모임") {
            window.location.href = `/meeting/${name}/edit`
        } else if (url === "회원목록") {
            window.location.href = `/meeting/${name}/user`
        } else if (url === "모임 삭제") {
            const conf = window.confirm("삭제하시면 되돌리실 수 없습니다. 정말로 모임을 삭제하시겠습니까?");
            if(conf){
                await axios.get(`/Moim/${name}/moimDetail`)
                    .then(res => {
                        if (res.data.user.length > 1) {
                            Alert.fire({
                                html: "다른 회원이 있을 경우 모임을 삭제하실 수 없습니다",
                                icon: "error",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            })
                        } else {
                            deleteMoim();
                        }
                    })
                    .catch(error => console.log(error))
            }
        }else if(url === "공지작성"){
            window.location.href =`/meeting/${name}/notice/write`
        }else if (url === "모임 탈퇴") {
            const conf = window.confirm("탈퇴하시면 되돌리실 수 없습니다. 정말로 모임을 탈퇴하시겠습니까?");
            if(conf){
                await axios.post(`/Moim/${name}/moimOut`, {id})
                    .then(res => {
                        if (res.data !== "fail") {
                            Alert.fire({
                                html: "해당 모임에서 성공적으로 탈퇴되었습니다",
                                icon: "success",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            }).then((res) => {
                                window.location.href = `/meetings/1`;
                            });
                        }else{
                            Alert.fire({
                                html: "이미 탈퇴하신 모임입니다",
                                icon: "error",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            })
                        }
                    })
                    .catch(error => console.log(error))
            }
        }
    }

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
            paddingLeft: '-20px'
        },
    }));

    return(
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"au"}}>
            <div className="sidebar">
                <LinkBar onClickMet={notice} text={"공지사항"} bold={"bold"}></LinkBar>
                <LinkBar onClickMet={() => {checkUserList(name, "공지작성")}} bold={"no"} text={" - 공지 작성"}></LinkBar>
                <LinkBar onClickMet={cal} text={"캘린더"} bold={"bold"}></LinkBar>
                <SidebarLink text="모임" />
                <LinkBar onClickMet={() => {checkUserList(name, "모임")}} bold={"no"} text={" - 모임 관리"}></LinkBar>
                {/*<a href='/meeting/manage' style={{color:"#000000", textDecorationLine:"none"}}>*/}
                <LinkBar onClickMet={() => {checkUserList(name, "회원목록")}} bold={"no"} text={" - 회원목록"}></LinkBar>
                {/*</a>*/}
                {
                    data.leader !== undefined && data.leader === id
                        ? (
                            data.applicants !== undefined && data.applicants.length > 0
                                ? (
                                    data.applicants.length > 99
                                        ?<BadgeCompo appLen={"99+"} onClickMet={() => {checkUserList(name, "신청자")}}
                                                     linkText={" - 신청자 관리"}></BadgeCompo>
                                        : <BadgeCompo appLen={data.applicants.length} onClickMet={() => {checkUserList(name, "신청자")}}
                                                      linkText={" - 신청자 관리"}></BadgeCompo>
                                )
                                : <LinkBar onClickMet={() => {checkUserList(name, "신청자")}} bold={"no"} text={" - 신청자 관리"}></LinkBar>
                        )
                        :   <LinkBar onClickMet={() => {checkUserList(name, "신청자")}} bold={"no"} text={" - 신청자 관리"}></LinkBar>
                }
                <LinkBar onClickMet={() => {checkUserList(name, "회의록")}} text={"회의록"} bold={"bold"}></LinkBar>
                <LinkBar onClickMet={() => {checkUserList(name, "공부")}} text={"공부"} bold={"bold"}></LinkBar>
                <LinkBar onClickMet={() => {checkUserList(name, "채팅")}} text={"채팅"} bold={"bold"}></LinkBar>
                <LinkBar onClickMet={() => {checkUserList(name, "투표")}} text={"투표"} bold={"bold"}></LinkBar>
                {
                    data.leader === id
                    ?<LinkBar onClickMet={() => {checkUserList(name, "모임 삭제")}} text={"모임 삭제"} bold={"bold"}></LinkBar>
                        : <LinkBar onClickMet={() => {checkUserList(name, "모임 탈퇴")}} text={"모임 탈퇴"} bold={"bold"}></LinkBar>
                }
            </div>
        </Paper>
    );
}

export default MeetingSidebar;