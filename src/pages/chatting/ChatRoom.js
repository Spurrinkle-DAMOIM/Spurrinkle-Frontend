import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import IconButton from "@mui/material/IconButton";
import CustomizedInputBase from "../../component/CustomizedInputBase";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import SendIcon from '@mui/icons-material/Send';
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {useParams} from "react-router-dom";
import axios from "axios";
import ChatBubble from 'react-chat-bubble';
import AppBar from "@mui/material/AppBar";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

const image = 'http://www.bradfordwhite.com/sites/default/files/images/corporate_imgs/iStock_000012107870XSmall.jpg';

var stompClient =null;
function ChatRoom() {
    useEffect(async () => {

        console.log(params);
        getMessage();
        connect();


    },[]);
    const [privateChats, setPrivateChats] = useState([]);
    const params = useParams().roomId;
    const [roomData, setRoomData] = useState({
        roomId:"",
        senderName:"",
        message:"",
    });

    const connect = () => {
        let Sock = new SockJS('/ws');
        stompClient = over(Sock);
        console.log("5번 지점: "+privateChats);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setRoomData({...roomData,"roomId": params,});
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        // stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);

        stompClient.subscribe('/sub/chat/room/'+params, onPrivateMessage);
        console.log("4번 지점: "+privateChats);
        console.log("요거봐줘: "+ params);

        // userJoin();
    }

    const onError = (err) => {
        console.log("에러: "+ err);

    }

    const sendPrivateValue=()=>{
        if(roomData.message !==""){
            if (stompClient) {
                var chatMessage = {
                    senderName: sessionStorage.getItem("id"),
                    roomId: roomData.roomId,
                    message: roomData.message,
                };
                console.log("chatmessage가 뜨면 성공: "+chatMessage )
                console.log("1번 지점: "+privateChats);
                stompClient.send("/pub/private-message", {}, JSON.stringify(chatMessage));
                setRoomData({...roomData,"message": ""});
                console.log("2번 지점: "+privateChats);
            }
        }
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        console.log(value);
        setRoomData({...roomData,"message": value});
    }

    const onPrivateMessage = (payload)=>{
        console.log("3번 지점: "+privateChats);
        var payloadData = JSON.parse(payload.body);
        console.log("받았다!: "+payload + " 자 드가자");
        console.log("요요요용: "+payloadData.senderName);
        console.log("이게맞나?"+privateChats)

        privateChats.push(payloadData);
        // setPrivateChats(new Array(privateChats));
        setPrivateChats([...privateChats, privateChats]);
    }

    const getMessage = ()=>{

       axios.post(`/chat/getChatList`, {roomId:params})
            .then(res =>{
                console.log(res.data);
                res.data.map(data=>{privateChats.push(data); setPrivateChats([...privateChats, privateChats])});
                console.log("6번 지점: "+privateChats);
            })
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
                        ><div align={"center"} style={{fontSize:"30px", fontWeight:"bold", fontFamily:"ImcreSoojin", margin:"10px"}}>바르고 고운 말!</div></AppBar>
                        <div style={{ height:"550px", width:"auto", overflow:"scroll"}}>
                            {/*{console.log(privateChats.length)}*/}
                            {privateChats.map(privateChat => {
                                if(privateChat.senderName !== undefined){
                                    if(privateChat.senderName === sessionStorage.getItem("id")){
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

                                                        <td rowSpan={2}> <img style={{height: "40px", width:"40px", marginLeft:"20px", borderRadius: "70px", overflow:"hidden"}} src={"https://frameworklab.imweb.me/common/img/default_profile.png"}/></td>

                                                        <td><div style={{marginLeft:"8px",marginTop:"10px", color:"darkgray", fontWeight:"bold", fontSize:"14px"}}>귀여운 익명친구</div></td>
                                                    </tr>
                                                    <tr>

                                                        <td>
                                                            <div style={{maxWidth:"300px", width:"auto", marginLeft:"20px",marginRight:"8px"}}>
                                                            <span style={{width:"auto", marginTop:"10px" ,paddingTop:"6px", paddingBottom:"6px", paddingLeft:"10px",borderCollapse:"collapse", borderRadius: "10px", backgroundColor:"lightgreen", color:"white"}}>{privateChat.message}</span>
                                                            </div>
                                                        </td>
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
        </>
    );
}


export default ChatRoom;