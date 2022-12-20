import React, {useEffect, useState} from 'react';
import {Grid, Stack, Container, Checkbox, Button, Paper, Modal, Box} from "@mui/material";
import {useParams} from "react-router-dom";
import axios from "axios";
import Alert from "sweetalert2";
import AppBar from "@mui/material/AppBar";

function Vote(props) {
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);
    const label = {inputProps: {'aria-label': 'Checkbox demo'}};
    const [datas, setData] = useState([]);
    const [vote, setVote] = useState("");
    const [voteList, setVoteList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [userName, setUserName] = useState([]);
    const [check, setCheck] =useState(false);
    const [userVote, setUserVote] = useState("");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const userId = sessionStorage.getItem('id');

    const getData = async () => {
        console.log(meetName);
        await axios.get(`/vote/${params.voteId}`)
            .then(res => {
                const data = res.data;
                console.log("1111111",data);
                setData([data]);
                const userList = [];
                const list = Array.from({length: data.list.length}, (v, i) => 0);

                for(var i=0; i<data.list.length; i++){
                    for(var j=0; j<data.onList[i].users.length; j++){
                        userList.push(data.onList[i].users[j]);
                        if(data.onList[i].users[j] === sessionStorage.getItem('id')){
                            setUserVote(data.onList[i].vote);
                            console.log(data.onList[i].users[j],"가 ",data.onList[i].vote,"투표함");
                        }
                    }
                    list[i] = data.onList[i].users.length;
                    console.log("list", list);
                }

                setUserList(userList);
                setVoteList(list);
                console.log("userList", userList)
                console.log("voteList", voteList)




                }
            )
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getData();
    }, []);

    const checkOnlyOne = (checkThis) => {
        const checkboxes = document.getElementsByName('voteList');
        setVote(checkThis.value);
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false
            }
        }
    }
    const onClickVote = async (id) => {
        if (vote === "") {
            Alert.fire({
                html: "투표 항목을 선택해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        } else {
            const check = window.confirm(vote + "에 투표하시겠습니까?");
            if (!check) {
                return;
            }
        }
        const obj = {
            meetName,
            user: sessionStorage.getItem("id"),
            vote,
        }
        await axios.post(`/vote/user/${id}/vote`, obj)
            .then(res => {

                    if (res.data !== "fail") {
                        Alert.fire({
                            html: "투표가 완료되었습니다",
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
    const onClickOff = async (voteID) => {
        console.log("voteID: ", voteID);
        await axios.post(`/vote/off`, {voteID: voteID})
            .then(res => {
                    if (res.data !== "fail") {
                        Alert.fire({
                            html: "해당 투표가 종료되었습니다",
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
    const onClickDelete = async (voteID) => {
        await axios.post(`/vote/delete`, {voteID: voteID})
            .then(res => {
                    if (res.data !== "fail") {
                        Alert.fire({
                            html: "해당 투표가 삭제되었습니다",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        }).then((res) => {
                            window.location.href = `/meeting/${meetName}/voteList`
                        });
                    }
                }
            )
            .catch(error => console.log(error))
    }

    return (
        <>
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "821px"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"30px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"30px"}}>   투표</div>
            </AppBar>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {
                        datas.map(data => {
                            const onList = data.onList;
                            const userCheck = userList.indexOf(userId);
                            return (
                                <>
                                    <div style={{
                                        marginTop: "14px",
                                        fontWeight: "bold",
                                        fontSize: "30px"
                                    }}>Q. {data.title}</div>
                                    {/*    질문 16자*/}
                                    <div align={"center"}>
                                        <hr style={{width: "90%",}}/>
                                    </div>
                                    {/*아마 list.map*/}
                                    <Grid container spacing={1}>
                                        {
                                            data.list.map((da, idx) => {
                                                let voteData;
                                                if (userCheck !== -1) {
                                                    voteData = userVote;
                                                }
                                                return (
                                                    <>
                                                        <br/>
                                                        <Grid item xs={1}>
                                                            <div align={"right"} style={{fontSize: "17px"}}>
                                                                {idx + 1}
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={9}>
                                                            <div align={"center"} style={{fontSize:"17px"}}>
                                                                <Button onClick={handleOpen}>{da}</Button>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {
                                                                userCheck !== -1
                                                                    ? (
                                                                        da === voteData
                                                                            ?
                                                                            // <input type="checkbox" name="voteList"
                                                                            //          value={da}
                                                                            //          style={{width: "24px", height: "24px"}}
                                                                            //          checked={true}/>
                                                                            <div style={{fontSize:"20px", fontWeight:"bold"}}>{data.onList[idx].users.length} 명</div>
                                                                            :
                                                                            // <input type="checkbox" name="voteList"
                                                                            //          value={da}
                                                                            //          style={{width: "24px", height: "24px"}}
                                                                            //          disabled={true}/>
                                                                            <div style={{fontSize:"20px", fontWeight:"bold"}}>{data.onList[idx].users.length} 명</div>
                                                                    )
                                                                    : (
                                                                        data.onOff === true
                                                                            ? <input type="checkbox" name="voteList"
                                                                                     value={da}
                                                                                     style={{width: "24px", height: "24px"}}
                                                                                     disabled={true}/>
                                                                            : <input type="checkbox" name="voteList"
                                                                                     value={da}
                                                                                     onChange={(e) => checkOnlyOne(e.target)}
                                                                                     style={{
                                                                                         width: "24px",
                                                                                         height: "24px"
                                                                                     }}/>
                                                                    )
                                                            }
                                                        </Grid>
                                                    </>
                                                )
                                            })
                                        }
                                    </Grid>
                                    <div style={{paddingTop: 30}}>
                                        {
                                            data.onOff === false
                                                ? (userList.includes(userId)
                                                    ? <><Button variant="contained" disabled={true}>투표완료</Button></>
                                                    : <><Button variant="contained" onClick={() => {
                                                        onClickVote(data.id)
                                                    }}>투표 하기</Button></>)
                                                : <Button variant="contained" disabled={true}>투표종료</Button>
                                        }
                                        {
                                            data.onOff === false
                                                ? (data.host === userId
                                                    ? <Button variant="contained" onClick={() => {
                                                        onClickOff(data.id)
                                                    }}
//                                                               style={{marginLeft: "14px"}}>투표삭제</Button>
//                                                     : null
//                                             }
//                                             <Button variant="contained" onClick={() => {
//                                                 window.location.href = `/meeting/${meetName}/voteList`
//                                             }}
//                                                     style={{marginLeft: "14px"}}>투표목록</Button>
//                                         </div>
//                                     </>
//                                 )
//                             })
//                         }
//                     </Grid>
                                                              style={{marginLeft: "14px", backgroundColor:"darkred"}}>투표종료</Button>
                                                    : null)
                                                : null
                                        }
                                        {
                                            data.host === userId
                                                ? <Button variant="contained" onClick={() => {
                                                    onClickDelete(data.id)
                                                }}
                                                          style={{marginLeft: "14px", backgroundColor:"darkred"}}>투표삭제</Button>
                                                : null
                                        }
                                        <Button variant="contained" onClick={() => {
                                            window.location.href = `/meeting/${meetName}/voteList`
                                        }}
                                                style={{marginLeft: "14px"}}>투표목록</Button>
                                    </div>
                                </>
                            )
                        })
                    }
                    </Grid>{/*<==============여ㄱ;*/}    
                    </Grid>
            </Paper>
            <Modal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <h2 id="unstyled-modal-title">Text in a modal</h2>
                    <p id="unstyled-modal-description">Aliquid amet deserunt earum!</p>
                </Box>
            </Modal>
        </>

    );

}

export default Vote;