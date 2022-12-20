import {
    Avatar, Pagination, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button
} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {useNavigate, useParams} from "react-router-dom";
import AppBar from "@mui/material/AppBar";

function MyBoard() {
    const params = useParams();
    let [page, setPage] = useState(params.page);
    const navigate = useNavigate();
    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});
    const [totalPage, setTotalPage] = useState('');
    const [myBoards, setMyBoards] = useState([]);

    const getUserBoard = async (id) => {
        await axios.get(`/board/${id}/myBoard`, {
            params: {
                page: page,
            },
        })
            .then(res => {
                console.log("??");
                console.log(res.data);
                setMyBoards(res.data.content);
                setTotalPage(res.data.totalPages);
            })
    };

    const onClickMyBoard = async (useId, boardId) => {
        await axios.get(`/user/${useId}/uniName`)
            .then(res => {
                window.location.href = `/board/${res.data}/${boardId}`;
            })
    };

    useEffect(() => {
        const id = sessionStorage.getItem("id");
        console.log("??");
        if (parseInt(page) < 0 || isNaN(parseInt(page))) {
            console.log("0보다 작음", parseInt(page));
            navigate(`/myPage/myBoard/${1}`);
            page = 1;
            setPage(1);
            forceUpdate();
        }
        getUserBoard(id);
    }, []);

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "830px", height:"auto"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>나의 게시물</div>
            </AppBar>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>제목&nbsp;</TableCell>
                            <TableCell align={"center"}>날짜&nbsp;</TableCell>
                            <TableCell align={"center"}>/&nbsp;</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            myBoards.map(board => {
                                return (<>
                                    <TableRow
                                        // key={data.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell align={"center"}>{board.title}</TableCell>
                                        <TableCell align={"center"}>{dayjs(board.date).format("YYYY-MM-DD")}</TableCell>
                                        <TableCell align={"center"}>
                                            <Button variant={"contained"} onClick={() => {
                                                onClickMyBoard(board.author, board.id)
                                            }}>게시물 이동
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </>)
                            })
                        }
                    </TableBody>
                </Table>
                <div style={{paddingLeft: "30%"}}>
                    <Stack spacing={2}>
                        <Pagination count={totalPage} showFirstButton showLastButton
                                    defaultPage={parseInt(page)} boundaryCount={3}
                                    onChange={(e, value) => {
                                        setPage(value);
                                        window.location.href = `/myPage/myBoard/${value}`;
                                    }}
                                    onClick={(e, p) => {
                                        console.log(p);
                                    }}/>
                    </Stack>
                </div>
            </TableContainer>
        </Paper>)
}

export default MyBoard;