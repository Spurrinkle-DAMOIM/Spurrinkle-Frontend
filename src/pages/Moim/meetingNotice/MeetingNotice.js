import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

export default function MeetingNotice(props) {
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);

    const [datas, setDatas] = useState([]);

    const getData = async () => {
        await axios.get(`/Moim/announcement/${meetName}/list`)
            .then((res) => {
                if (res !== null) {
                    console.log(res.data);
                    setDatas(res.data);
                }
            })
    }
    useEffect(() => {
        getData();
    }, [])

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "auto", minHeight:"820px",}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            ><div align={"left"} style={{paddingLeft:"20px", margin:"18px", fontSize:"30px", fontWeight:"bold"}}>공지사항 목록</div></AppBar>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>번호</TableCell>
                            <TableCell align={"center"}>제목</TableCell>
                            <TableCell align={"center"}>작성자&nbsp;</TableCell>
                            <TableCell align={"center"}>등록일&nbsp;</TableCell>
                            <TableCell align={"center"}>/</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        datas.map((data,idx) => {
                            return(
                                <>
                                    <TableBody>
                                        <TableRow
                                            // key={row.name}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell align={"center"}>{idx+1}</TableCell>
                                            <TableCell align={"center"}>{data.title}</TableCell>
                                            <TableCell align={"center"}>{data.userId}</TableCell>
                                            <TableCell align={"center"}>{data.date}</TableCell>
                                            <TableCell align={"center"}>
                                                <Button variant={"contained"} onClick={() => {
                                                    window.location.href = `/meeting/${meetName}/notice/${data.id}`; // todo : <- detail이 :id로 들어가야 함
                                                }}>확인하기</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </>
                            )
                        })
                    }
                </Table>
            </TableContainer>
        </Paper>
    );
};