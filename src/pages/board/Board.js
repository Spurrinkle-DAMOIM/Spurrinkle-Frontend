import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as colorThumbsUp, faStar as colorStar, faEllipsisVertical,
    faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp, faComment, faStar} from "@fortawesome/free-regular-svg-icons";
import {MenuItem, Typography, IconButton, Container, Grid, Paper} from "@mui/material";
import {Menu, InputBase} from "@mui/material";
import Comment from "../../component/Comment";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import getDate from "./BoardDate.js";
import {createBrowserHistory} from "history";
import imgDelete from "../../component/ImgDelete";
import Alert from 'sweetalert2';
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";

function Board(){
    const navigate = useNavigate();
    const history = createBrowserHistory();
    const etcs = ['수정', '삭제' ];
    const params = useParams();
    const uni = params.uni;
    const data = useNavigate();
    const [delImgs, setDelImgs] = useState([])
    const [stars, setStars] = useState(false);
    const [datas, setData] = useState([]);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElNav1, setAnchorElNav1] = useState(null);
    const [anchorElNav2, setAnchorElNav2] = useState(null);
    const [use, setUse]=useState("");
    const [clickUser, setClicUser] = useState(""); //댓글전용
    const [userClick, setUserClick] = useState("")//대댓글전용


    const [replys, setReply] = useState([]);    // 댓글
    const [ids, setID] = useState("");
    const [replyCnt, setReplyCnt] = useState(false);    // 수정버튼 클릭 여부
    const [replyCount, setReplyCount] = useState([]);   // 각각의 댓글 수
    const [reReply, setReReply] = useState("");
    const [reReplyDatas, setReReplyDatas] = useState([]);   // 대댓글
    const [commNum, setCommNum] = useState(0);
    // const [chatUsers, setChatUsers] = useState([]);

    const handleOpenNavMenu1 = (event, id, data) => {
        if (data === sessionStorage.getItem("id")) {
            setClicUser(data)
            setAnchorElNav1(event.currentTarget);
            setID(id);
        }
    };

    const handleOpenNavMenu2 = (event, id, data) => {
        if (data === sessionStorage.getItem("id")) {
            setClicUser(data)
            setAnchorElNav2(event.currentTarget);
            setID(id);
        }
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav1(null);
        setAnchorElNav2(null);
        setID("");
        setReplyCnt(false);
    };

    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const open1 = Boolean(anchorEl1);

    const handleClick1 = (event, data) => {
        if(data !== sessionStorage.getItem("id")){
            console.log("h1",data)
            setUse(data);
            setAnchorEl1(event.currentTarget);
        }
    };

    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);

    const handleClick2 = (event, data) => {
        console.log("data", data);
        if(sessionStorage.getItem("id") !== data) {

            setClicUser(data);
            setAnchorEl2(event.currentTarget);
        }
    };


    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const open3 = Boolean(anchorEl3);
    const handleClick3 = (event, data) => {

        if (data !== sessionStorage.getItem("id")) {
            console.log("dd", data)
            setUserClick(data)
            setAnchorEl3(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl1(null);
        setAnchorEl2(null);
        setAnchorEl3(null);
    };


    const getReply = async (id) => {
        await axios.post(`/board/${id}/replySearch`, id)
            .then(res => {
                const data = getDate(res.data);
                console.log("DATA: ", res.data);
                const reply = res.data;
                let count = reply.length;  // 댓글+대댓글 수
                const replyCountArr = [];
                for(var i = 0; i < reply.length; i++) {
                    let reReplyCount = 0;
                    for(var j = 0; j < reply[i].reReply.length; j++) {
                        reReplyCount++;
                        count++;
                    }
                    replyCountArr.push(reReplyCount);   // 각 댓글의 대댓글수
                }
                replyCountArr.push(count);  // 게시물 댓글수
                setReplyCount(replyCountArr);
                setReply(data);
            })
            .catch(error => console.log(error));
    }
    const getData = async (id) => {
        await axios.post(`/board/${id}`, id)
            .then(res => {
                const data = getDate([res.data]);
                setData(data);
            })
            .catch(error => console.log(error));
        await getReply(id);
    }
    useEffect(() => {
        getData(params.id);
    }, []);

    const onClickReply = async (e, id) => {
        const content = document.getElementsByName("reply-content")[0].value;
        if(content === "")
        {
            Alert.fire({
                html: "댓글 내용을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        const reply = {
            boardID: id,
            author: sessionStorage.getItem("id"),
            content: content,
            likes: 0,
            likesUser: [],
            reReply: []
        };
        await axios.post(`/board/${id}/replyWrite`, reply)
            .then(res => {
                if (res.data === "success") {
                    allClear();
                    document.getElementsByName("reply-content")[0].value = "";
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
        await getReply(id);
    }
    const onClickStar = (e) =>{
        if(stars == false){setStars(true)}
        else{setStars(false)}
    }
    const onClickUpdate = async (e, id) => {
        data(`/board/${id}/update`, { state: datas[0] });
    }
    const onClickDelete = async (e, id) => {
        console.log("확인: ",datas[0].img);
        await setDelImgs(datas[0].img);
        console.log("확인: ",delImgs);

        await axios.post(`/board/${id}/delete`)
            .then(async res => {
                let cnt = 0;
                if(res.data === "success"){
                    window.location.href = `/boardMain/${uni}/1`;
                }else{
                    Alert.fire({
                        html: "DB 에러",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const onClickReplyUpdate = async (e, cnt, id, url) => {
        console.log(id)
        setAnchorElNav1(null);
        setAnchorElNav2(null);
        if(cnt === "수정"){
            setReplyCnt(true);
        }else if(cnt === "삭제"){
            const test = ids.split("/");
            if(test.length == 2){
                const obj = {
                    id: Number(test[0]),
                };
                console.log(obj);
                await axios.post(`/board/${test[1]}/reReply/delete`, obj)
                    .then(res => {
                        if (res.data !== "fail") {
                            allClear();
                            getReply(id);
                        } else {
                            Alert.fire({
                                html: "DB 에러",
                                icon: "error",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            });
                        }
                        setID("");
                    })
                    .catch(error => console.log(error));
            }else{
                await axios.post(`/board/${test[0]}/reply/delete`, ids)
                    .then(res => {
                        if (res.data !== "fail") {
                            allClear();
                            getReply(id);
                        } else {
                            Alert.fire({
                                html: "DB 에러",
                                icon: "error",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            });
                        }
                        setID("");
                    })
                    .catch(error => console.log(error));
            }
        }else{
            setReplyCnt(false);
            console.log("신고")
        }
    }
    const onClickReplyUpdateCnt = async (e, id) => {
        const reply = {
            id: ids,
            content: document.getElementsByName("replyCnt")[0].value,
        };
        await axios.post(`/board/${ids}/reply/update`, reply)
            .then(res => {
                if (res.data !== "fail") {
                    replys[0].content = res.data;
                    allClear();
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
                setID("");
            })
            .catch(error => console.log(error));
    }
    const onClickReReplyUpdateCnt = async (e) => {
        const test = ids.split("/");
        const reply = {
            id: Number(test[0]),
            content: document.getElementsByName("reReplyCnt")[0].value,
        };
        await axios.post(`/board/${test[1]}/reReply/update`, reply)
            .then(res => {
                if (res.data !== "fail") {
                    allClear();
                    getReply(params.id);
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
                setID("");
            })
            .catch(error => console.log(error));
    }
    const onClickLike = async (e, id) => {
        const userID = sessionStorage.getItem("id");
        if(userID === null) {
            Alert.fire({
                html: "로그인이 필요합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.post(`/board/${id}/like`, {id:userID})
            .then(res => {
                console.log("LikesData: ", res.data);
                if(res.data.likes !== undefined){
                    const data = getDate([res.data]);
                    setData(data);
                }
            })
            .catch(error => console.log(error));
    }
    const onClickReplyLike = async (e, id) => {
        console.log("id",id)
        id = id.split("$");
        const userID = sessionStorage.getItem("id");
        const obj = {
            id:userID,
        };
        if(userID === null) {
            Alert.fire({
                html: "로그인이 필요합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.post(`/board/${id}/reply/like`, obj)
            .then(async res => {
                console.log("LikesData: ", res.data);
                if (res.data.likes !== "fail") {
                    await getReply(res.data);
                }
            })
            .catch(error => console.log(error));
    }
    const onClickReReplyLike = async (e, id) => {
        const sp = id.split("$");
        const userID = sessionStorage.getItem("id");
        const obj = {id:userID};
        obj.reRE = sp[1];
        if(userID === null) {
            Alert.fire({
                html: "로그인이 필요합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.post(`/board/${sp[0]}/reReply/like`, obj)
            .then(async res => {
                console.log("LikesData: ", res.data);
                if (res.data.likes !== "fail") {
                    await getReply(res.data);
                }
            })
            .catch(error => console.log(error));
    }
    const [showComment,setShowComment] = useState(false);
    function vComment(e){
        setShowComment(current => !current);
        setReReply(e.currentTarget.id);
    }
    const onClickReReply = async (e, id) => {
        const reReply = {
            boardID: id,
            author: sessionStorage.getItem("id"),
            content: document.getElementsByName("reReply-content")[0].value,
            likes: 0,
            likesUser: [],
        };
        await axios.post(`/board/${id}/reReplyWrite`, reReply)
            .then(res => {
                if (res.data !== "fail") {
                    allClear();
                    getReply(params.id);
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const allClear = () => {
        setReplyCnt(false);
        setID("");
        setReReply("");
    }


    const postId = async (e,data) =>{
        console.log("data1", data)
        const userList =[];
        userList.push(data);
        userList.push(sessionStorage.getItem("id"));
        console.log(userList)

        if(data !== sessionStorage.getItem("id") ){
            console.log(userList);
            axios.post(`/chat/createRoom`,
                {userId:userList}
            )
                .then((res)=>{
                    console.log("roomId"+res.data);
                    // location.href="/chat/"+res.data;
                    // history.push("/chat/"+res.data);
                    navigate("/chat/"+res.data);
                })
        }else{
            console.log("같은 사람끼리 채팅 만들게 되있나?>")
        }
    }


    let num = 0;
    let boo = false;
    let userCnt = 1;
    return(
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto", minHeight:"788px" }} >
        <AppBar

            position="static"
            color="default"
            style={{backgroundColor:"#dae6f1"}}
            elevation={0}
            sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)', fontWeight:"bold",}}
        ><div align={"left"} style={{margin:"14px", marginLeft:"40px", fontSize:"40px"}}>게시판</div></AppBar>
        <table align ="center" border={0} cellSpacing={0.5} style={{width: "700px", marginTop:"16px"}}>
            <tr>
                <td>
                    <div style={{marginLeft: "16px", marginTop: "12px", marginBottom:"16px"}}>
                        {
                            datas.map(data => {
                                return(
                                    <>
                                        <div style={{display: "flex"}}>
                                            <div>
                                                {/*<button onClick={()=> {postId(data.author)}}>*/}
                                                <div
                                                    id="basic-button1"
                                                    aria-controls={open1 ? 'basic-menu1' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open1 ? 'true' : undefined}
                                                    onClick={(e)=>{handleClick1(e, data.author) } }>
                                                    <img style={{height: "50px", width:"50px"}} src={"https://frameworklab.imweb.me/common/img/default_profile.png"}/>
                                                </div>
                                                <Menu
                                                    id="basic-menu1"
                                                    anchorEl={anchorEl1}
                                                    open={open1}
                                                    onClose={handleClose}
                                                    MenuListProps={{
                                                        'aria-labelledby': 'basic-button1',
                                                    }}
                                                >
                                                    <MenuItem onClick={(e)=>{postId(e,use)}}>1:1 채팅</MenuItem>

                                                </Menu>




                                            </div>
                                            <div style={{flexDirection: "column", marginLeft: "12px", verticalAlign:"middle", paddingTop: "4px"}}>
                                                <div style={{textAlign: "left"}}>익명</div>
                                                <div>{data.date}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 style={{marginTop:"10px"}}>{data.title}</h3>
                                            <div style={{marginBottom: "20px"}}>{data.content}</div>
                                            {
                                                data.img.length === 0
                                                    ? null
                                                    : (data.img.map(im => {
                                                        console.log(im);
                                                        return(
                                                            <>
                                                                <img src={im} style={{width: "200px", height:"200px"}}/>
                                                            </>
                                                        );
                                                    }))
                                            }
                                            <div>
                                                {
                                                    data.likesUser.includes(sessionStorage.getItem("id"))
                                                        ? <><FontAwesomeIcon onClick={(e)=> onClickLike(e, params.id)}
                                                                             style={{color: "#8B0000", width:"20px", height:"20px"}} icon={colorThumbsUp} />
                                                            <span style={{color: "#8B0000", fontWeight:"bold", marginRight:"10px"}}>{data.likes}</span></>
                                                        : <><FontAwesomeIcon onClick={(e)=> onClickLike(e, params.id)}
                                                                             style={{color: "#8B0000", width:"20px", height:"20px"}} icon={faThumbsUp}/>
                                                            <span style={{color: "#8B0000", fontWeight:"bold", marginRight:"10px"}}>{data.likes}</span></>
                                                }
                                                <FontAwesomeIcon style={{color: "#4169E1", width:"20px", height:"20px"}} icon={faComment} />
                                                <span style={{color: "#4169E1", fontWeight:"bold", marginRight:"10px"}}>{replyCount[replyCount.length-1]}</span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })
                        }
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    {
                        replys.map((reply, index) => {
                            num++;
                            {
                                reply.id === reReply ? boo=true : boo=false
                            }
                            return(
                                <>
                                    <hr/>
                                    <div key={index} style={{marginLeft: "16px", marginTop: "12px", marginBottom:"12px"}}>
                                        <div style={{display: "flex"}}>
                                            <div
                                                id="basic-button2"
                                                aria-controls={open2 ? 'basic-menu2' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open2 ? 'true' : undefined}
                                                onClick={(e)=>{handleClick2(e, reply.author)}}
                                            >
                                                <img style={{height: "40px", width:"40px"}} src={"https://frameworklab.imweb.me/common/img/default_profile.png"}/>
                                            </div>
                                            <Menu
                                                    id="basic-menu2"
                                                    anchorEl={anchorEl2}
                                                    open={open2}
                                                    onClose={handleClose}
                                                    MenuListProps={{
                                                        'aria-labelledby': 'basic-button2',
                                                    }}
                                            >
                                                <MenuItem onClick={(e)=>{postId(e, clickUser)}}>1:1 채팅</MenuItem>

                                            </Menu>



                                            <div style={{marginLeft: "8px", paddingTop: "8px",  width:"100%"}}>
                                                {
                                                    reply.author === datas[0].author
                                                    ? <span id={num} class="reRelpyBtn"
                                                            style={{textAlign: "left", verticalAlign:"middle", color:"#483D8B", fontWeight:"bold"}}>{("익명"+userCnt++)+"(글쓴이)"}</span>
                                                        : <span id={num} class="reRelpyBtn" style={{textAlign: "left", verticalAlign:"middle", fontWeight:"bold"}}>{"익명"+userCnt++}</span>
                                                }
                                                <div style={{float: "right", marginRight:"26px", backgroundColor:"#eeeaea",
                                                    width:"18%", height:"30px", verticalAlign:"middle", textAlign:"center",
                                                    borderRadius: "6px"}}>
                                                    <div style={{marginLeft:'10px'}}>
                                                        <IconButton
                                                            id={reply.id}
                                                            style={{height:'10px', width:'10px'}}
                                                            onClick={(e)=>vComment(e)}>
                                                            <FontAwesomeIcon style={{color: "gray"}} icon={faComment} />
                                                        </IconButton>
                                                        <span style={{marginLeft:'10px'}}>|</span>
                                                        <IconButton
                                                            onClick={(e)=> onClickReplyLike(e, reply.id)}
                                                            style={{height:'10px', width:'10px'}}>
                                                            {
                                                                reply.likesUser.includes(sessionStorage.getItem("id"))
                                                                    ? <FontAwesomeIcon style={{color: "gray", marginLeft:"15px"}} icon={colorThumbsUp}/>
                                                                    : <FontAwesomeIcon style={{color: "gray", marginLeft:"15px"}} icon={faThumbsUp}/>
                                                            }
                                                        </IconButton>
                                                        <span style={{marginLeft:'15px'}}>
                                                            |
                                                        </span>
                                                        <IconButton
                                                            style={{height:'5px', width:'5px'}}
                                                            onClick={(e) => {handleOpenNavMenu1(e, reply.id, reply.author)}}
                                                        >
                                                            <FontAwesomeIcon style={{color: "gray", marginLeft:"8px"}} icon={faEllipsisVertical}/>
                                                        </IconButton>
                                                        {
                                                            <Menu
                                                                    sx={{ ml:'20px' }}
                                                                    id="menu-appbar"
                                                                    anchorEl={anchorElNav1}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'right',
                                                                    }}
                                                                    keepMounted
                                                                    transformOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'right',
                                                                    }}
                                                                    open={Boolean(anchorElNav1)}
                                                                    onClose={handleCloseNavMenu}
                                                                >
                                                                    {etcs.map((etc) => (
                                                                        <MenuItem key={etc} onClick={(e) => {onClickReplyUpdate(e, etc, params.id, "")}}>
                                                                            <Typography textAlign="center" id={reply.id}>{etc}</Typography>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Menu>

                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                replyCnt === true && reply.id === ids
                                                    ?
                                                    <><Paper style={{ marginTop:'10px', width:'96%'}}>   {/* Paper tag 여기 수정 예저ㅏㅇ */}
                                                        <InputBase sx={{ ml: 1, flex: 1 }} inputProps={{ 'aria-label': 'search google maps' }}
                                                                   style={{fontSize:"14px", marginTop:"8px", width:'88%'}}
                                                                   defaultValue={reply.content} name={"replyCnt"}/>
                                                        <IconButton style={{height:'8px', width:'8px'}}>
                                                            <FontAwesomeIcon style={{color: "gray", marginLeft:"8px", height:'18px', width:'18px'}}
                                                                             onClick={onClickReplyUpdateCnt} icon={faPaperPlane}/></IconButton>
                                                        <button style={{fontSize:"14px", marginLeft:"6px", color:"gray", border:"none", backgroundColor:"white"}} onClick={onClickReply}
                                                                onClick={()=>setReplyCnt(false)}>닫기</button>
                                                    </Paper>

                                                    </>
                                                    : <div style={{fontSize:"14px"}}>{reply.content}</div>
                                            }
                                            <div>
                                                <span style={{fontSize:"12px", color:"darkgray"}}>{reply.date}</span>
                                                {
                                                    reply.likes > 0
                                                        ? <><FontAwesomeIcon style={{color: "#8B0000", width:"15px", height:"15px", marginLeft:'5px'}} icon={faThumbsUp} />
                                                            <span style={{fontSize: "15px" , color: "#8B0000", fontWeight:"bold", marginRight:"10px"}}>{reply.likes}</span></>
                                                        : <><span></span></>
                                                }
                                                {
                                                    replyCount[index] !== 0
                                                        ? <>&nbsp;&nbsp;
                                                            <FontAwesomeIcon style={{color: "#4169E1", width:"15px", height:"15px"}} icon={faComment} />
                                                            <span style={{fontSize: "15px", color: "#4169E1", fontWeight:"bold", marginRight:"10px"}}>{replyCount[index]}</span>
                                                        </>
                                                        : null
                                                }

                                            </div>
                                            <div style={{marginTop:'10px'}}>
                                                {showComment
                                                    ? (
                                                        boo === true
                                                            ? <div><Comment id={reply.id} onClick={(e) => {onClickReReply(e, reply.id)}}/></div>
                                                            : null
                                                    )
                                                    :null}
                                            </div>
                                        </div>
                                        {/*------------------------여기부터 대댓글---------------------*/}
                                        <div style={{marginTop:'15px'}}>

                                            <Container fixed>
                                                {
                                                    reply.reReply.map(re => {
                                                        return(
                                                            <>
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={1}>
                                                                        <SubdirectoryArrowRightIcon/>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <Grid container spacing={1}>
                                                                            <Grid item xs={12}>
                                                                                <div
                                                                                    id="basic-button3"
                                                                                    aria-controls={open3 ? 'basic-menu3' : undefined}
                                                                                    aria-haspopup="true"
                                                                                    aria-expanded={open3 ? 'true' : undefined}
                                                                                    onClick={(e)=>{handleClick3(e, re.author)}}>
                                                                                    <img style={{height: "30px", width:"30px"}} src={"https://frameworklab.imweb.me/common/img/default_profile.png"}/>
                                                                                    {
                                                                                    re.author === datas[0].author
                                                                                        ? <span style={{fontWeight:"bold", color:"#483D8B",}}>{(" 익명" + userCnt++)+("(글쓴이)")}</span>
                                                                                        : <span style={{fontWeight:"bold"}}>{" 익명" + userCnt++}</span>
                                                                                    }
                                                                                </div>
                                                                                {
                                                                                    <Menu
                                                                                        id="basic-menu3"
                                                                                        anchorEl={anchorEl3}
                                                                                        open={open3}
                                                                                        onClose={handleClose}
                                                                                        MenuListProps={{
                                                                                            'aria-labelledby': 'basic-button3',
                                                                                        }}
                                                                                    >
                                                                                        <MenuItem onClick={()=>{postId(userClick)}}>1:1 채팅</MenuItem>
                                                                                    </Menu>
                                                                                }
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item xs={4}></Grid>
                                                                    <Grid item xs={2}>
                                                                        <div style={{background:'#eeeaea', borderRadius: "6px", height:'30px', width:'76px', marginLeft:'20px'}}>
                                                                            <IconButton
                                                                                onClick={(e)=> onClickReReplyLike(e, reply.id+"$"+re.id)}
                                                                                style={{height:'10px', width:'10px', marginLeft:'10px'}}>
                                                                                {
                                                                                    re.likesUser.includes(sessionStorage.getItem("id"))
                                                                                        ? <FontAwesomeIcon style={{color: "gray", marginLeft:"15px"}} icon={colorThumbsUp}/>
                                                                                        : <FontAwesomeIcon style={{color: "gray", marginLeft:"15px"}} icon={faThumbsUp}/>
                                                                                }
                                                                            </IconButton>
                                                                            <span style={{marginLeft:'15px'}}>
                                                                                |
                                                                                </span>
                                                                            <IconButton
                                                                                style={{height:'5px', width:'5px'}}
                                                                                onClick={(e) => {handleOpenNavMenu2(e, re.id + "/"+reply.id, re.author)}}
                                                                            >
                                                                                <FontAwesomeIcon style={{color: "gray", marginLeft:"8px"}} icon={faEllipsisVertical}/>
                                                                            </IconButton>
                                                                            {
                                                                                <Menu
                                                                                        sx={{ ml:'20px' }}
                                                                                        id="menu-appbar"
                                                                                        anchorEl={anchorElNav2}
                                                                                        anchorOrigin={{
                                                                                            vertical: 'bottom',
                                                                                            horizontal: 'right',
                                                                                        }}
                                                                                        keepMounted
                                                                                        transformOrigin={{
                                                                                            vertical: 'top',
                                                                                            horizontal: 'right',
                                                                                        }}
                                                                                        open={Boolean(anchorElNav2)}
                                                                                        onClose={handleCloseNavMenu}
                                                                                    >
                                                                                        {etcs.map((etc) => (
                                                                                            <MenuItem key={etc} onClick={(e) => {onClickReplyUpdate(e, etc, params.id, "reReply")}}>
                                                                                                <Typography textAlign="center">{etc}</Typography>
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Menu>

                                                                            }
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={1}></Grid>
                                                                    {
                                                                        replyCnt === true && re.id+"/"+reply.id === ids
                                                                            ? <>
                                                                                <Grid item xs={11}>
                                                                                    <Paper style={{width:"80%"}}>
                                                                                        <InputBase style={{fontSize:"14px", marginTop:"6px", width:"84%", marginLeft:"12px"}} defaultValue={re.content} name={"reReplyCnt"}/>
                                                                                        <IconButton style={{height:'8px', width:'8px'}} onClick={onClickReReplyUpdateCnt}>
                                                                                            <FontAwesomeIcon style={{color: "gray", marginLeft:"8px", height:'18px', width:'18px'}}
                                                                                                             icon={faPaperPlane}/></IconButton>
                                                                                        <button style={{fontSize:"14px", marginLeft:"6px", color:"gray", border:"none", backgroundColor:"white"}}
                                                                                                onClick={()=>setReplyCnt(false)}>닫기</button>
                                                                                    </Paper>
                                                                                </Grid>

                                                                            </>
                                                                            : <Grid item xs={11}>
                                                                                <div style={{fontSize:'14px'}}>{re.content}</div>
                                                                            </Grid>
                                                                    }
                                                                    <Grid item xs={1}></Grid>
                                                                    <Grid item xs={11}>
                                                                        <div style={{width:'200px'}}>
                                                                            <span style={{fontSize:"12px", color:"darkgray"}}>{re.date}</span>
                                                                            {
                                                                                re.likes > 0
                                                                                    ? <><FontAwesomeIcon style={{color: "#8B0000", width:"15px", height:"15px", marginLeft:'5px'}} icon={faThumbsUp} />
                                                                                        <span style={{fontSize: "15px" , color: "#483D8B", fontWeight:"bold", marginRight:"10px"}}>{re.likes}</span></>
                                                                                    : null
                                                                            }
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </>
                                                        );
                                                    })
                                                }
                                            </Container>
                                        </div>
                                    </div>
                                </>
                            );
                        })
                    }
                </td>
            </tr>
            <tr>
                <td>
                    <hr />
                    <div style={{textAlign:"center"}}>
                        <span style={{marginRight:"6px"}}>댓글</span>
                        <input type="text" placeholder={"댓글을 입력해주세요"} name="reply-content" style={{width:"600px", border:"none", outline:"none"}}/>
                        <IconButton><FontAwesomeIcon style={{color: "gray", height:"20px", width:"20px", marginLeft:"8px", paddingTop:"2px"}}
                                                     onClick={(e) => {onClickReply(e, params.id)}} icon={faPaperPlane}/>
                        </IconButton>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div style={{float: "right", marginTop:"16px", marginBottom:"20px"}}>
                        <Button variant="contained" onClick={(e) => {window.location.href=`/boardMain/${uni}/1`}}
                        style={{background:"#1976D2", color:"white"}}>
                            목록
                        </Button>
                        {
                            datas.length !== 0
                                ? (
                                    datas[0].author === sessionStorage.getItem("id")
                                        ? <>
                                            <Button variant="contained" onClick={(e) => {onClickUpdate(e, datas[0].id)}}
                                                    style={{background:"#1976D2", color:"white", marginRight:"2px"}}>
                                                수정
                                            </Button>
                                            <Button variant="contained" onClick={(e) => {onClickDelete(e, datas[0].id)}}
                                                    style={{color:"white", backgroundColor:"darkred"}}>
                                                삭제
                                            </Button>
                                        </>
                                        : null
                                )
                                : null
                        }
                    </div>
                </td>
            </tr>
        </table>
        </Paper>
    );
}
export default Board;