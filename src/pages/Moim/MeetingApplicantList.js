import * as React from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {leaderCheck} from "../../component/userCheck/MoimCheck";
import AppBar from "@mui/material/AppBar";

function createData(num, title, name, day) {
    return {num, title, name, day};
}

function MeetingApplicantList(props) {
    const [cnt, setCnt] = useState(0);
    const [datas, setDatas] = useState([]);
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);

    const getData = async () => {
        await axios.get(`/Moim/applicant/${meetName}/userCheck`)
            .then(async res => {
                const data = res.data;
                const arr = [];
                for (var i = 0; i < data.length; i++) {
                    const obj = createData(i + 1, '신청서', data[i].userId, data[i].date);
                    arr.push(obj);
                }
                setDatas(arr);
                setCnt(arr.length);
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        const id = sessionStorage.getItem("id");
        leaderCheck(meetName, id);
        getData();
    }, [])

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "821px"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"30px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"30px"}}>신청자 목록</div>
            </AppBar>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>번호</TableCell>
                            <TableCell align={"center"}>글</TableCell>
                            <TableCell align={"center"}>이름&nbsp;</TableCell>
                            <TableCell align={"center"}>날짜&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        cnt === 0 ?
                            <TableHead style={{height: 764.5}}>
                                <TableCell colSpan={4} align={"center"}>
                                    <strong style={{fontSize: "20px"}}>신청자가 존재하지 않습니다</strong>
                                </TableCell>
                            </TableHead>
                            :
                            <TableBody>
                                {datas.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        onClick={() => {
                                            window.location.href = `/meeting/${meetName}/applicantList/detail/${row.name}`;
                                        }}
                                    >
                                        <TableCell align={"center"}>{row.num}</TableCell>
                                        <TableCell align={"center"}>{row.title}</TableCell>
                                        <TableCell align={"center"}>{row.name}</TableCell>
                                        <TableCell align={"center"}>{row.day}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                    }
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default MeetingApplicantList;