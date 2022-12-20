import {
    Avatar,
    Pagination,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import * as React from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Alert from "sweetalert2";
import {useCallback, useEffect, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";


function MoimUserList(props) {
    const params = useParams();
    const [totalPage, setTotalPage] = useState('');
    let [page, setPage] = useState(1);
    const limit = 10;
    const [offset, setOffset] = useState((page - 1) * limit);
    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});

    const [datas, setData] = useState([]);
    const [listData, setListData] = useState([]);

    const getData = async () => {
        await axios.get(`/Moim/${params.meetName}/moimDetail`)
            .then(async res => {
                    if (res.data !== "fail") {
                        console.log(res.data);
                        const data = res.data;
                        setTotalPage(Math.ceil(res.data.user.length / 10));
                        const userList = [];
                        for (var i = 0; i < data.user.length; i++) {
                            await axios.get(`/Moim/${data.user[i]}/user`)
                                .then(res => {
                                        if (res.data !== "fail") {
                                            const obj = [];
                                            obj.push(data.user[i]);  // 유저 아이디
                                            obj.push(res.data);  // 유저 정보

                                            // 해당 유저가 모임 리더라면 0번째 값이랑 변경
                                            if (data.user[i] === data.leader && i !== 0) {
                                                const temp = userList[0];
                                                userList[0] = obj;
                                                userList.push(temp);
                                            } else {
                                                userList.push(obj);
                                            }
                                        }
                                    }
                                )
                                .catch(error => console.log(error))
                        }
                        data.user = userList;
                        console.log(data);
                        setData([data]);
                        console.log("이게 왜 없겠냐..", datas)
                        await pagenation(res.data, 1);
                    }

                }
            )
            .catch(error => console.log(error))
    }

    const jsType = (data) => {  //타입 확인 함수 ( Array , Object 확인 )
        return Object.prototype.toString.call(data).slice(8, -1);
    }

    const pagenation = (data, nowPage) => {
        console.log(jsType(data));
        if (jsType(data) === "Object") {
            setListData(data.user.slice(((nowPage - 1) * 10), ((nowPage - 1) * 10) + limit));
        } else if (jsType(data) === "Array") {
            setListData(data[0].user.slice(((nowPage - 1) * 10), ((nowPage - 1) * 10) + limit));
        }
    }

    const onClickOut = async (userId) => {
        const comf = window.confirm("정말 " + "'" + userId + "'님을 강퇴하시겠습니까?");
        if (!comf) {
            return;
        }
        await axios.post(`/Moim/${params.meetName}/userOut`, {userId})
            .then(res => {
                    if (res.data !== "fail") {
                        Alert.fire({
                            html: "'" + userId + "'님이 강퇴되었습니다",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        });
                        getData();
                    }
                }
            )
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getData();
    }, []);

    const searchInput = document.querySelector('#searchKey');

    const delegate = async (id) => {
        await axios.post(`/Moim/${params.meetName}/delegate`, {delegate: id})
            .then(res => {
                    if (res.data !== "fail") {
                        Alert.fire({
                            html: "성공적으로 위임되었습니다",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        }).then((res)=>{
                            getData();
                            window.location.reload();
                        });
                    }
                }
            )
            .catch(error => console.log(error))
    };

    const click = () => {
        let str = "";
        for (var i = 0; i < datas[0].user.length; i++) {
            if (datas[0].leader !== datas[0].user[i][0]) {
                str += '<div class="table-responsive">\n' +
                    '      <table class="table">\n' +
                    '      <tbody>\n' +
                    '      <tr>\n' +
                    '      <td>' + datas[0].user[i][0] + '</td>\n' +
                    '      <td>' + datas[0].user[i][1].uniName + '</td>\n' +
                    '      <td>' + datas[0].user[i][1].uniName + '</td>\n' +
                    '      <td><input type="radio" name="member" /></td>\n' +
                    '      </tr>\n' +
                    '      </tbody>\n' +
                    '      </table>\n' +
                    '      </div>\n'
            }
        }
        Alert.fire({
            title: '회원 리스트',
            html: '<div style="overflow:scroll;">' +
                str +
                '</div>',
            showCancelButton: true,
            cancelButtonText: "닫기",
            confirmButtonText: "위임하기",
            confirmButtonColor: "#1976D2"
        })
            .then((res) => {
                if (res.value) {
                    const check = document.getElementsByName("member");
                    console.log(check)
                    let cnt = 0;
                    let newLeader;
                    for (var i = 0; i < check.length; i++) {
                        if (check[i].checked === true) {
                            newLeader = datas[0].user[++i][0];
                            cnt++;
                            break;
                        }
                    }
                    if (cnt === 0) {
                        console.log(res);
                        Alert.fire({
                            html: "방장을 위임할 회원을 선택해주세요",
                            icon: "error",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        });
                        return;
                    }
                    delegate(newLeader);
                }
            });
    }

    return (
        <>
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "821px", height:"auto"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"30px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"30px"}}>회원 목록</div>
            </AppBar>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>프로필</TableCell>
                            <TableCell align={"center"}>닉네임</TableCell>
                            <TableCell align={"center"}>계급&nbsp;</TableCell>
                            <TableCell align={"center"}>대학교&nbsp;</TableCell>
                            <TableCell align={"center"}>비고</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            datas.map(data => {
                                return (
                                    <>
                                        {

                                            listData.map((da, idx) => {
                                                return (

                                                    <TableRow
                                                        key={da[0]}
                                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                    >
                                                        {/*이미지*/}
                                                        <TableCell align={"center"}>
                                                            <div align={"center"}>
                                                                <Avatar
                                                                    src={da[1].img}
                                                                    style={{margin: '10px', align: 'center'}}
                                                                    sx={{width: 55, height: 55}}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell align={"center"}>{da[0]}</TableCell>
                                                        {
                                                            idx === 0
                                                                ? <TableCell align={"center"}>모임장</TableCell>
                                                                : <TableCell align={"center"}>회원</TableCell>
                                                        }
                                                        <TableCell align={"center"}>{da[1].uniName}</TableCell>
                                                        {
                                                            data.leader === sessionStorage.getItem("id") && da[0] !== data.leader
                                                                ? <TableCell align={"center"}>
                                                                    <Button
                                                                        style={{backgroundColor: "darkred"}}
                                                                        variant={"contained"}
                                                                        onClick={() => {
                                                                        onClickOut(da[0])
                                                                    }}>강퇴하기
                                                                    </Button>
                                                                </TableCell>
                                                                : (
                                                                    data.leader === sessionStorage.getItem("id") && da[0] === data.leader
                                                                    && data.user.length !== 1
                                                                        ? <TableCell align={"center"}>
                                                                            <Button variant={"contained"} onClick={click}>방장 위임하기</Button>
                                                                        </TableCell>
                                                                        : null
                                                                )
                                                        }
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
            <div style={{paddingLeft: "40%", paddingTop:"10px"}}>
                <Stack spacing={2}>
                    <Pagination count={parseInt(totalPage)} showFirstButton showLastButton
                                defaultPage={page} boundaryCount={3}
                                onChange={(e, value) => {
                                    console.log(value);
                                    console.log("click datas", datas);
                                    setPage(value);
                                    pagenation(datas, value);
                                    forceUpdate();
                                }}
                                onClick={(e, p) => {
                                    console.log("누르: ", p);
                                }}/>
                </Stack>
            </div>
        </>
    );
};

export default MoimUserList;