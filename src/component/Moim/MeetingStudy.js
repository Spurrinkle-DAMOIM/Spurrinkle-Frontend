import * as React from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Container from "@mui/material/Container";
import {Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import StudyRank from "../../component/Moim/Study/StudyRank.js";

export default function MeetingStudy(props) {
    const params = useParams();
    const meetName = params.meetName;
    const [users, setUsers] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    props.meetName(meetName);

    const getUserInfo = async (userList) => {
        console.log("겟인포: ", userList);
        await axios.post(`/user/userListInfo`, {userList})
            .then(res => {
                setUserInfo(res.data);
            })
            .catch(error => console.log(error))
    }
    // url 검색으로 넘어오는거 막기
    const checkUserList = async () => {
        await axios.get(`/Moim/${meetName}/moimUserStudy`)
            .then(res => {
                const data = res.data;
                console.log(data);
                const userList = data[data.length-1].userList.split(" ");

                getUserInfo(userList);

                if (!userList.includes(sessionStorage.getItem("id"))) {
                    alert("모임 가입자만 이용할 수 있습니다.");
                    return;
                }
                setUsers(data);
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        if(sessionStorage.getItem("id") === null){
            alert("로그인해주시기 바랍니다.");
            window.location.href = "/login";
        }
        checkUserList();
    }, [])

    let cnt = 0;
    return(
        <>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"776px" }} >
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor:"#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <div style={{fontSize:"30px", fontWeight:"bold", marginTop:"10px", marginBottom:"10px"}}>{meetName}</div>
                </AppBar>

                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>

                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <div style={{fontSize:"50px", fontWeight:"bold", fontFamily:"ImcreSoojin", marginTop:"60px"}} >공부왕</div>
                                </Grid>
                                {
                                    userInfo.map((user, idx) => {
                                        return(
                                            <>
                                                {
                                                    idx === 0 || idx === 1 || idx === 2
                                                        ? <>
                                                            <StudyRank num={idx + 1} data={userInfo} userData={users}/>
                                                        </>
                                                        : null
                                                }
                                            </>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={6}>
                            <div e style={{marginTop:"20px"}}>
                                <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'scroll', height:"660px" }} >
                                    <TableContainer component={Paper}>
                                        <Table  aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align={"center"}>순위</TableCell>
                                                    <TableCell align={"center"}>사진/닉네임</TableCell>
                                                    <TableCell align={"center"}>시간</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    users.map((user, idx1) => {
                                                        ++cnt
                                                        return(<>
                                                                {
                                                                    idx1 !== users.length - 1
                                                                        ? (Object.entries(user).map((key, idx) => {
                                                                            return (<>
                                                                                {
                                                                                    key[1] !== "00H:00M:00S"
                                                                                        ? <TableRow>
                                                                                            <TableCell align={"center"}>{cnt}</TableCell>
                                                                                            <TableCell align={"center"}>
                                                                                                <div align={"center"}>
                                                                                                    {
                                                                                                        userInfo.length !== 0
                                                                                                            ? <img style={{height: "50px", width: "50px"}}
                                                                                                                   src={userInfo[idx1].img}/>
                                                                                                            : null
                                                                                                    }
                                                                                                </div>
                                                                                                <div>{key[0]}</div>
                                                                                            </TableCell>
                                                                                            <TableCell align={"center"}>{key[1]}</TableCell>
                                                                                        </TableRow>
                                                                                        : <TableRow>
                                                                                            <TableCell align={"center"}>{"X"}</TableCell>
                                                                                            <TableCell align={"center"}>
                                                                                                <div align={"center"}>
                                                                                                    {
                                                                                                        userInfo.length!== 0
                                                                                                            ? <img style={{height: "50px", width: "50px"}}
                                                                                                                   src={userInfo[idx1].img}/>
                                                                                                            : null
                                                                                                    }
                                                                                                </div>
                                                                                                <div>{key[0]}</div>
                                                                                            </TableCell>
                                                                                            <TableCell align={"center"}>{key[1]}</TableCell>
                                                                                        </TableRow>
                                                                                }
                                                                            </>)
                                                                        })) : null


                                                                } </>
                                                        )

                                                    })
                                                }
                                            </TableBody>
                                        </Table>

                                    </TableContainer>
                                </Paper>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </>
        //123등사진이랑 정렬된 공부시간 보내주면 고맙겠소
    );
}