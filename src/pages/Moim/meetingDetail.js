import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {Paper, Grid, Button} from "@mui/material";
import AppBar from "@mui/material/AppBar";


function MeetingDetail(props) {
    const [userLists, setUserLists] = useState([]);
    const [leaderInfo, setLeaderInfo] = useState({});
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);

    const onCLick = () => {
        // window.location.href = ''
    }

    const getLeaderData = async (leaderId) => {
        await axios.get(`/user/${leaderId}/userInfo`)
            .then(async res => {
                const data = res.data;
                setLeaderInfo(data);
                console.log(res.data);
            })
            .catch(error => console.log(error))
    }

    const getData = async () => {
        await axios.get(`/Moim/${meetName}/moimDetail`)
            .then(async res => {
                const data = res.data;
                setUserLists(data);
                getLeaderData(data.leader);
                console.log(res.data);
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "820px", height:"auto"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            ><div align={"left"} style={{paddingLeft:"30px", margin:"20px" ,fontWeight:"bold", fontSize:"30px"}}>모임 정보</div></AppBar>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <div align={"center"} style={{paddingTop: 23}}><h2><b>{userLists.meetName}</b></h2></div>
                    <div align={"center"} style={{paddingTop: 3}}>
                        <hr style={{width: "90%"}}/>
                    </div>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item xs={1}></Grid>
                        <Grid item xs={3}>
                            <div style={{paddingTop: 60}}>
                                <div style={{border: "solid", textAlign: "center"}}>
                                    <img style={{height: "100%", width: "100%"}}
                                         src={userLists.img}/>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={8}>
                            <div align={"left"} style={{paddingLeft: 15}}>
                                <div style={{fontSize: "19px"}}><strong>카테고리</strong></div>
                                <div style={{paddingBottom: 15, fontSize: "17px"}}>{userLists.category}</div>
                                {
                                    userLists.category === "공모전"
                                        ? <div style={{fontSize: "19px"}}><strong>공모전</strong></div>
                                        && <div style={{
                                            paddingBottom: 15,
                                            fontSize: "17px"
                                        }}>{userLists.contestName}</div>
                                        : null
                                }
                                <div style={{fontSize: "19px"}}><strong>모임 설명</strong></div>
                                <div style={{paddingBottom: 15, fontSize: "17px"}}>{userLists.meetIntro}</div>
                                <div style={{fontSize: "19px"}}><strong>정원 수</strong></div>
                                <div style={{fontSize: "17px"}}>{userLists.nowuser}/{userLists.userCnt}</div>
                            </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={3}><br/><br/><br/><br/>
                            <div align={"center"} style={{paddingBottom: 3, fontSize: "17px"}}><b>모임장</b></div>
                            <div align={"center"} style={{paddingTop: 15}}>
                                <div align={"center"}>
                                    <img style={{height: "130px", width: "130px"}}
                                         src={leaderInfo.img}/>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={5}>
                            <div align={"left"} style={{paddingLeft: 15}}>
                                <div style={{fontSize: "16px", paddingBottom: 3}}><strong>이름</strong></div>
                                <div style={{fontSize: "14px", paddingBottom: 10}}>{leaderInfo.name}</div>
                                <div style={{fontSize: "16px", paddingBottom: 3}}><strong>대학교</strong></div>
                                <div style={{fontSize: "14px", paddingBottom: 13}}>{leaderInfo.uniName}</div>
                            </div>
                        </Grid>
                        {/* <Grid item xs={3}> */}
                        <Grid item xs={2}>
                        </Grid>
                        <Grid item xs={7}>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{marginBottom:"-10px"}}>
                            {
                                userLists.length !== 0
                                    ? (
                                        !userLists.user.includes(sessionStorage.getItem("id"))
                                            ? (userLists.applicants.includes(sessionStorage.getItem("id"))
                                                ? <Button variant="contained" style={{width: "110px", }}>가입신청완료</Button>
                                                : <Button variant={"contained"} style={{width: "110px", }} onClick={() => {
                                                    window.location.href = `/meeting/${meetName}/application`;
                                                }}>가입신청</Button>)
                                            : null
                                    )
                                    : null
                            }&nbsp;&nbsp;
                            <Button variant={"contained"} style={{width:"110px"}} onClick={()=>{window.history.back()}}>목록</Button>
                            </div>
                        </Grid>

                        <Grid item xs={1}/>
                    </Grid>
                </Grid>
            </Grid><br/><br/>
        </Paper>
    );
}

export default MeetingDetail;