import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import Container from "@mui/material/Container";
import {Grid, Pagination, Stack, useMediaQuery} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import CustomizedInputBase from "../../component/CustomizedInputBase";
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import { BsPencilSquare } from "react-icons/bs";
import getDate from "./BoardDate.js";
import {useNavigate, useParams} from "react-router-dom";
import queryString from 'query-string';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PopuBoard from "../../component/Board/PopuBoard";
import Alert from 'sweetalert2';
import Modal from "@mui/material/Modal";

function SimpleMediaQuery(){
    const matches = useMediaQuery('(min-width:600px)');
}

function BoardMain(props) {
    const params = useParams();
    const uni = params.uni;
    const [state,updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});
    let [page, setPage] = useState(params.page);
    const [totalPage, setTotalPage] = useState('');
    const [datas, setData] = useState([]);
    const navigate = useNavigate();
    const [pageApi, setPageApi] = useState(1);
    const searchWord = window.location.search.split('=')[1];
    const [popus, setPopus] = useState([]); // 인기 게시글


    const getData = async () => {


        await axios.get(`/board/${uni}/main/1`)
            .then (async res => {
                setTotalPage(res.data.totalPages);
                console.log("전체 페이지: ",res.data.totalPages);
                console.log(typeof res.data.totalPages);

                if(parseInt(page) < 0 || isNaN(parseInt(page))){
                    console.log("0보다 작음",parseInt(page));
                    navigate(`/BoardMain/${uni}/${1}`);
                    page = 1;
                    setPage(1);
                    forceUpdate();

                }else if(res.data.totalPages < parseInt(page)){
                    console.log("총 페이지 보다 큼!!")
                    navigate(`/BoardMain/${uni}/${res.data.totalPages}`);
                    page = res.data.totalPages;
                    setPage(res.data.totalPages);
                    forceUpdate();
                }
            })
            .catch(error => console.log(error))




        await axios.get(`/board/${uni}/main/${page}`)
            .then(res => {
                console.log(typeof page);
                console.log(res.data);

                console.log(page);
                console.log(res.data.content);
                const data = getDate(res.data.content);
                console.log(res.data.totalPages);
                setData(data)
            })
            .catch(error => console.log(error))
    }
    const getUni = async (id) => {
        let data;
        const search = queryString.parse(window.location.search);
        const searchCheck = window.location.search;
        console.log(search);
        console.log(searchCheck);
        await axios.get(`/user/${id}/uniName`)
            .then(async res => {
                data = res.data;
                if (data !== uni) {
                    Alert.fire({
                        html: "해당 대학교 학생만 접근하실 수 있습니다",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res) => {
                        window.location.href = "/";
                    })
                } else {
                    if(searchCheck === '') {
                        console.log('검색어 없음');
                        getData();
                    }else{
                        console.log('검색어 있음');
                        getSearchData();
                    }
                }
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        const id = sessionStorage.getItem("id");

        if(id === null){
            Alert.fire({
                html: "로그인이 필요합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            }).then((res) => {
                window.location.href = "/login";  
            })
        }
        getUni(id);

    }, []);
    const getSearchData = async () => {
        console.log("검색하는중");
        const obj = queryString.parse(window.location.search);

        console.log(obj);
        await axios.post(`/board/${uni}/search/${page}`, obj)
            .then(res => {
                console.log(res.data);

                if(res.data.content.length === 0){
                    Alert.fire("", "해당 게시물은 존재하지 않습니다", "error");
                    getData(uni);
                    return;
                }
                const data = getDate(res.data.content)
                setTotalPage(res.data.totalPages);
                setData(data)
                // if (res.data !== "fail") {
                //     if(res.data.length == 0){
                //         alert("해당 게시물은 존재하지 않습니다.");
                //         getData(uni);
                //         return;
                //     }
                //     const data = getDate(res.data)
                //     setData(data)
                // } else {
                //     alert("DB Error");
                // }
            })
            .catch(error => console.log(error));
    }
    const onClickSearch = (e) => {
        const search = document.getElementsByName("searchBoard")[0].value;
        window.location.href=`/boardMain/${uni}/${1}?search=${search}`
    }
    return (
        <>
        <Container > {/*대충 이부분 고쳤다는 그런 느낌적인 느낌*/}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto", minHeight:"730px" }} >
                        <AppBar
                            position="static"
                            color="default"
                            style={{backgroundColor:"#dae6f1"}}
                            elevation={0}
                            sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                        >
                            <div style={{paddingTop:"10px"}}>
                                <Grid container spacing={6}>
                                    <Grid item xs={4}>
                                        <span style={{fontSize:'44px',fontWeight:'bold'}}>자유게시판</span>
                                    </Grid>
                                    <Grid item xs={6}></Grid>
                                    <Grid item xs={2}>
                                        <Tooltip title="게시글 추가1">
                                            <IconButton
                                                style={{marginTop:'14px', width:'auto', marginLeft:"20px"}}
                                                onClick={() => window.location.href = "/boardWrite"}>
                                                <EditIcon style={{width:"30px", height:"30px"}} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{paddingBottom:"20px", paddingTop:"20px", paddingLeft:"10px", paddingRight:"10px"}} >
                                <CustomizedInputBase onClick={onClickSearch}/>
                            </div>
                        </AppBar>


                        {
                            datas.map(data => {
                                return(
                                    <>
                                    <div style={{marginTop: "15px", paddingLeft:"34px"}}>
                                        <div align={"left"} style={{fontSize:"18px", fontWeight: "bold",}}>
                                            <a href={`/board/${uni}/${data.id}`} style={{textDecoration: "none", color:"black", overflow: "hidden", width:"700px",
                                                textOverflow:"ellipsis",
                                                whiteSpace: "nowrap",
                                                display: "block",
                                                wordBreak:"break-word"
                                                }}>{data.title}</a>
                                        </div>
                                        <div align={"left"} style={{marginRight:"80px" ,fontSize: "14px" , marginTop: "2px", color: "darkgray", overflow: "hidden", width:"700px",
                                            textOverflow:"ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block",
                                            wordBreak:"break-word"}}>
                                            {data.content}
                                        </div>
                                        <div align={"left"}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={9}>
                                                    <span style={{fontSize: "10px", color: "darkgray"}}>{data.date}</span>
                                                    <span style={{fontSize: "10px"}}>&nbsp;&nbsp; 익명</span>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <div style={{marginLeft:"60px"}}>
                                                    <span >
                                                        <FontAwesomeIcon style={{color: "#8B0000", width:"15px", height:"15px"}} icon={faThumbsUp} />
                                                        <span style={{fontSize: "15px" , color: "#8B0000", fontWeight:"bold", marginRight:"10px"}}>{data.likes}</span>
                                                    </span>
                                                    <span>
                                                        <FontAwesomeIcon style={{color: "#4169E1", width:"15px", height:"15px"}} icon={faComment} />
                                                        <span style={{fontSize: "15px", color: "#4169E1", fontWeight:"bold", marginRight:"10px"}}>{data.replyCnt}</span>
                                                    </span>
                                                    </div>
                                                </Grid>

                                            </Grid>
                                        </div>
                                    </div>
                                    <hr style={{width:"90%"}}/>
                                    </>
                                );
                            })
                        }
                    </Paper>
                    <div style={{paddingLeft:"35%", paddingTop:25}}>
                        <Stack spacing={2}>
                            <Pagination count={totalPage} showFirstButton showLastButton
                                        defaultPage={ parseInt(page)} boundaryCount={3}
                                        onChange={(e, value) =>
                                        {
                                            setPageApi(value);
                                            if(window.location.search === '') {window.location.href=`/boardMain/${uni}/${value}`}
                                            else{console.log("들어옴",searchWord);window.location.href=`/boardMain/${uni}/${value}?search=${searchWord}`}
                                        }}
                                        onClick={(e,p) => {console.log(p);}}/>
                        </Stack>
                    </div>
                </Grid>
            </Grid>
        </Container>
        </>
    );
}

export default BoardMain;