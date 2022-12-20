import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import CustomizedInputBase from "../../component/CustomizedInputBase";
import SearchIcon from "@mui/icons-material/Search";
import {Paper, IconButton, Box, Button, Modal, AppBar} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {useParams} from "react-router-dom";
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import Typography from '@mui/material/Typography';
import {TextField, InputBase} from '@mui/material';
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import uuid from 'react-uuid';
import dayjs from "dayjs";
import getDate from "../board/BoardDate";
import {Table} from "@mui/material";
import Alert from 'sweetalert2';


var stompClient =null;
function MoimChatRoom(props) {
    const [i , setI] = useState(1);
    const [state, updateState] = useState();
    const [voteList, setVoteList] = useState([uuid(),uuid()]);
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(async () => {
        // console.log("챙팅창 들어옴")
        getMessage();
        connect();
    },[]);
    const [privateChats, setPrivateChats] = useState([]);
    const params = useParams().meetName;
    props.meetName(params);
    const [roomData, setRoomData] = useState({
        roomId:"",
        senderName:"",
        message:"",
        img:"",
    });

    const connect = () => {
        let Sock = new SockJS('/ws');
        stompClient = over(Sock);
        // console.log("5번 지점: "+privateChats);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setRoomData({...roomData,"roomId": params,});
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        // stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);

        stompClient.subscribe('/sub/chat/room/'+params, onPrivateMessage);
        // console.log("4번 지점: "+privateChats);
        // console.log("요거봐줘: "+ params);

        // userJoin();
    }

    const onError = (err) => {
        console.log("에러: "+ err);

    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: JSON.parse(sessionStorage.getItem('user')).nickname,
                roomId: roomData.roomId,
                message: roomData.message,
                img: JSON.parse(sessionStorage.getItem('user')).img,
            };
            // console.log("chatmessage가 뜨면 성공: "+chatMessage )
            // console.log("1번 지점: "+privateChats);
            stompClient.send("/pub/private-message", {}, JSON.stringify(chatMessage));
            setRoomData({...roomData,"message": ""});
            // console.log("2번 지점: "+privateChats);
        }
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        // console.log(value);
        setRoomData({...roomData,"message": value});
    }

    const onPrivateMessage = (payload)=>{
        // console.log("3번 지점: "+privateChats);
        var payloadData = JSON.parse(payload.body);
        // console.log("받았다!: "+payload + " 자 드가자");
        // console.log("요요요용: "+payloadData.senderName);
        // console.log("이게맞나?"+privateChats)

        privateChats.push(payloadData);
        // setPrivateChats(new Array(privateChats));
        setPrivateChats([...privateChats, privateChats]);
    }

    const getMessage = ()=>{

        axios.post(`/chat/getChatList`, {roomId:params})
            .then(res =>{
                console.log(res.data);
                res.data.map(data=>{privateChats.push(data); setPrivateChats([...privateChats, privateChats])});
                // console.log("6번 지점: "+privateChats);
            })
    }

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

    const plus = ()=>{
        if(voteList.length<=10){
            // console.log("길이",voteList.length)
            voteList.push(uuid());
            setVoteList(voteList);
            forceUpdate();
        }

    }

    const minus = (id)=>{
        if(voteList.length>2) {
            // console.log("전체",voteList);
            // console.log("rkqt",id);
            setVoteList(voteList.filter(list => (list !== id)));
        }
    }

    const makeVote = () => {
        const voteList = [];
        const list = document.getElementsByName("voteList");
        for(var i = 0; i < list.length; i++) {
            voteList.push(list[i].value);
        }
        console.log("삭제: ", voteList)
        
        // setVote([])
        //
        //
        //
        // axios.post("/vote/setVote", vote)
        //     .then()

        const title = document.getElementsByName("title")[0].value;
        if(title === "") {
            Alert.fire({
                html: "투표 제목을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if(voteList.includes("")) {
            Alert.fire({
                html: "투표 항목을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }

        const date = new Date();
        const vote = {
            meetName: params,
            host: sessionStorage.getItem('id'),
            title,
            onList: [],
            list:voteList, //가져와야함 투표항목
            date:dayjs(date).format("YYYY-MM-DD"), //오늘날짜 넘기기
            onOff:false, //빈값으로 넘기기 마감했는지 안했는지
        }
        saveVote(vote);
    }
    const saveVote = async (vote) => {

        console.log("VOTE: ", vote);
        await axios.post(`/vote/save`, vote)
            .then(res => {
                console.log("res", res);
                var chatMessage = {
                    senderName: JSON.parse(sessionStorage.getItem('user')).nickname,
                    roomId: roomData.roomId,
                    message: `투표를 만들었어요!          
                    투표해 주세요~~!!!`,
                    img: JSON.parse(sessionStorage.getItem('user')).img,
                };
                stompClient.send("/pub/private-message", {}, JSON.stringify(chatMessage))
            });
        handleClose();
    }

    return (
        <>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto" }} >
            <table align="center" border={2} style={{width:"80%", height:"400px", marginTop:"30px", marginBottom:"30px",borderCollapse:"collapse", borderRadius: "70px", borderColor:"#dae6f1"}}>
                <tr>

                    <AppBar

                        position="static"
                        color="default"
                        style={{backgroundColor:"#dae6f1"}}
                        elevation={0}
                        sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                    ><div align={"center"} style={{fontSize:"30px", fontWeight:"bold", fontFamily:"ImcreSoojin", margin:"10px"}}>{params} 채팅방</div></AppBar>
                    <div style={{ height:"550px", width:"auto", overflow:"scroll"}}>
                        {/*{console.log(privateChats.length)}*/}
                        {privateChats.map(privateChat => {
                            if(privateChat.senderName !== undefined){
                                if(privateChat.senderName === JSON.parse(sessionStorage.getItem('user')).nickname){
                                    return(
                                        <div align={"right"} style={{marginRight:"20px"}}>
                                            <table>
                                               <tr>
                                                   <td>
                                                       <div style={{maxWidth:"300px", width:"auto", marginRight:"8px" ,borderCollapse:"collapse", borderRadius: "10px", backgroundColor:"skyblue", color:"white"}}>
                                                           <div style={{width:"auto",margin:"10px", paddingTop:"6px", paddingBottom:"6px"}}>{privateChat.message}</div>
                                                       </div>
                                                   </td>
                                                   <td><img style={{height: "40px", width: "40px" ,borderRadius:"70%", overflow: "hidden"}}
                                                                          src={sessionStorage.getItem("user") === null ?
                                                                              "https://frameworklab.imweb.me/common/img/default_profile.png" : JSON.parse(sessionStorage.getItem("user")).img}/></td>
                                                </tr>
                                            </table>



                                        </div>
                                    )
                                }else{
                                    return(
                                        <>
                                            <table style={{marginBottom:"10px"}}>
                                                <tr >
                                                    <td rowSpan={2}> <img style={{height: "40px", width:"40px", marginLeft:"20px", borderRadius: "70px", overflow:"hidden"}} src={privateChat.img}/></td>

                                                    <td><div style={{marginLeft:"8px",marginTop:"10px", color:"darkgray", fontWeight:"bold", fontSize:"14px"}}>{privateChat.senderName}</div></td>
                                                </tr>
                                                <tr>

                                                    <td><div style={{maxWidth:"300px", width:"auto", marginLeft:"8px" ,borderCollapse:"collapse", borderRadius: "10px", backgroundColor:"lightgreen", color:"white"}}>
                                                        <div style={{width:"auto", paddingTop:"6px", paddingBottom:"6px", paddingLeft:"10px", paddingRight:"10px"}}>{privateChat.message}</div>
                                                    </div></td>
                                                </tr>
                                            </table>
                                        </>

                                    )
                                }
                            }


                        })}
                    </div>

                </tr>
                <tr style={{height:"20px"}}>
                    <div>
                        <Paper>

                            <IconButton onClick={handleOpen}>
                                <HowToVoteIcon/>
                            </IconButton>

                        </Paper>
                        <Paper
                            style={{ overflow:"scroll"}}
                            // component="form"
                            sx={{background:"lightgray", display: 'flex', alignItems: 'center', width: '100%' }}
                        >
                            <InputBase
                                style={{height:"100px"}}
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="좋은말 보내주세요!"
                                inputProps={{ 'aria-label': 'search google maps' }}
                                name={"searchBoard"}
                                value={roomData.message}
                                onChange={handleMessage}
                                multiline={true}
                            />

                            <IconButton type="button" sx={{ p: '7px' }} aria-label="search" onClick={sendPrivateValue}>
                                <SendIcon/>
                            </IconButton>
                        </Paper>
                    </div>
                </tr>
            </table>
            </Paper>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>투표</h3>
                    <hr/>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div align={"center"}>
                            <TextField id="standard-basic" name={"title"} label="투표 제목" variant="standard" style={{width:"440px"}} /><br/>
                        </div>
                        <span>
                                            {
                                                voteList.map(list =>{
                                                    // console.log(list)
                                                    return(
                                                        <div>
                                                            <TextField
                                                                id={list}
                                                                label="투표 항목"
                                                                name={"voteList"}
                                                                variant="standard"
                                                                style={{height:"30px", width:"320px"}}
                                                            />
                                                            <IconButton id={list} onClick={()=>{minus(list)}}>
                                                                <RemoveCircleIcon sx={{fontSize:"36px"}}/>
                                                            </IconButton>
                                                        </div>
                                                    )

                                                })
                                            }


                                        </span>

                    </Box>
                    <div align={"left"}>
                        <IconButton
                            onClick={plus}>
                            <AddBoxIcon sx={{fontSize:"20px"}}/>
                            <span style={{fontSize:"20px"}}>
                                                &nbsp;항목추가
                                            </span>
                        </IconButton>
                        <div align={"right"}>
                            <Button  variant="contained" style={{color:"white", backgroundColor:"mediumpurple"}}
                                     onClick={makeVote}>
                                Success
                            </Button>
                        </div>
                    </div>

                </Box>
            </Modal>
        </>
    );
}

export default MoimChatRoom;
