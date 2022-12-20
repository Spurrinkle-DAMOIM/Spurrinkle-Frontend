import {Avatar, Pagination, Paper, Stack, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import AppBar from "@mui/material/AppBar";


function VoteList(props) {
    const params = useParams();
    let [page, setPage] = useState(params.page);
    const navigate = useNavigate();
    const [state,updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});
    const [totalPage, setTotalPage] = useState('');
    const [cnt, setCnt] = useState(0);
    const [datas, setData] = useState([]);

    const getData = async () => {
        await axios.get(`/vote/${params.meetName}/list`,{
            params:{
                page: page,
            }
        })
            .then(res => {
                    if (res.data !== "fail") {
                        console.log(res.data);
                        setData(res.data.content);
                        setTotalPage(res.data.totalPages);
                        console.log(res.data);
                        setCnt(res.data.content.length);
                    }
                }
            )
            .catch(error => console.log(error))
    }

    useEffect(()=>{
        if(parseInt(page) < 0 || isNaN(parseInt(page))) {
            console.log("0보다 작음",parseInt(page));
            navigate(`/meeting/${params.meetName}/voteList/${1}`);
            page = 1;
            setPage(1);
            forceUpdate();
        }
        getData();
    },[]);


    return (
        <>
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "820px", height:"auto"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"30px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"30px"}}>투표 목록</div>
            </AppBar>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {
                        cnt === 0 ?
                            <TableHead >
                                <TableCell colSpan={4} align={"center"}>
                                    <strong style={{fontSize: "20px"}}>진행 중인 투표가 존재하지 않습니다</strong>
                                </TableCell>
                            </TableHead>
                            :
                            <>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align={"center"}>프로필</TableCell>
                                        <TableCell align={"center"}>유저 정보</TableCell>
                                        <TableCell align={"center"}>투표 이름</TableCell>
                                        <TableCell align={"center"}>투표 개설 날짜</TableCell>
                                        <TableCell align={"center"}>/</TableCell>
                                    </TableRow>
                                </TableHead>
                            <TableBody>
                                {datas.map((data) => (
                                    <TableRow
                                        key={data.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align={"center"}>
                                            <div align={"center"}>
                                            <Avatar
                                                src={data.user.img}
                                                style={{margin:'10px'}}
                                                sx={{ width: 55, height: 55}}
                                            />
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"}>{data.host}</TableCell>
                                        <TableCell align={"center"}>{data.title}</TableCell>
                                        <TableCell align={"center"}>{data.date}</TableCell>
                                        <TableCell align={"center"}>
                                            {
                                                data.onOff === true
                                                    ?<Button variant={"contained"} onClick={()=>{
                                                        window.location.href = `/meeting/${params.meetName}/${data.id}`;
                                                    }}>투표확인</Button>
                                                    : <Button variant={"contained"} onClick={()=>{
                                                        window.location.href = `/meeting/${params.meetName}/${data.id}`;
                                                    }}>투표하기</Button>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </>
                    }
                </Table>
            </TableContainer>
        </Paper>
            <div style={{paddingLeft:"40%", paddingTop:"10px"}}>
                <Stack spacing={2}>
                    <Pagination count={totalPage} showFirstButton showLastButton
                                defaultPage={ parseInt(page)} boundaryCount={3}
                                onChange={(e, value) =>
                                {
                                    setPage(value);
                                    window.location.href=`/meeting/${params.meetName}/voteList/${value}`;
                                }}
                                onClick={(e,p) => {console.log(p);}}/>
                </Stack>
            </div>
        </>
    );
};

export default VoteList;