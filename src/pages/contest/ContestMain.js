import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {Pagination, Stack} from "@mui/material";
import CustomizedInputBase from "../../component/CustomizedInputBase";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";

function ContestMain() {
    const params = useParams();
    let [page, setPage] = useState(params.page);
    const [totalPage, setTotalPage] = useState('');
    const [state,updateState] = useState();
    const navigate = useNavigate();
    const searchWord = window.location.search.split('=')[1];
    const forceUpdate = useCallback(() => updateState({}), {});

    const [datas, setData] = useState([]);


    useEffect(() => {
        const searchCheck = window.location.search;

        if(parseInt(page) < 0 || isNaN(parseInt(page))){
            console.log("0보다 작음",parseInt(page));
            page = 1;
            setPage(1);
            navigate(`/contest/${1}`);
            forceUpdate();
        }

        if(searchCheck === '') {
            console.log('검색어 없음');
            getData();
        }else{
            console.log('검색어 있음');
            getSearchData();
        }
    },[])

    function getData() {    //일반 데이터
        axios.get(`/crawling/getList/${page}`, {
            params:{
                page: page
            }
        })
            .then((res) => {
                console.log(res.data);
                const  data = res.data.content;
                setData(data);
                setTotalPage(res.data.totalPages);
            })
            .catch((err) => {})
    }

    function getSearchData() {  //검색된 데이터
        axios.get(`/crawling/getSearchList/${page}`, {
            params:{
                page: page,
                search: decodeURI(searchWord),
            }
        })
            .then((res) => {
                const  data = res.data.content;
                setData(data);
                setTotalPage(res.data.totalPages);
            })
            .catch((err) => {})
    }

    const onClickSearch = (e) => {
        const search = document.getElementsByName("searchBoard")[0].value;
        window.location.href=`/contest/${1}?search=${search}`
    }

    return (
        <>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto" }} >
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor:"#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>공모전</div>
                    <div style={{marginBottom:"20px"}}>
                        <CustomizedInputBase onClick={onClickSearch}/>
                    </div>
                </AppBar>
            <br style={{marginBottom:'10px'}}/>
            {
                datas.map(data => {
                    return(
                        <>
                            <div align={"left"} style={{fontSize:"15px", fontWeight: "bold", marginLeft:"40px"}}>
                                <a href={`/contest/detail/${data.id}`} style={{textDecoration: "none", color:"black"}}>{data.title}</a>
                            </div>
                            <div align={"left"}><span style={{fontSize: "10px", color: "darkgray", marginLeft:"40px"}}>{data.supervise}</span> <span style={{fontSize: "10px", color: "darkgray"}}>&nbsp;|&nbsp; {data.bonus}</span></div>
                            <div align={"right"}>
                                {/*        <span>*/}
                                {/*            <FontAwesomeIcon style={{color: "#8B0000", width:"15px", height:"15px"}} icon={faThumbsUp} />*/}
                                {/*            <span style={{fontSize: "15px" , color: "#8B0000", fontWeight:"bold", marginRight:"10px"}}>{data.likes}</span>*/}
                                {/*        </span>*/}
                                {/*<span>*/}
                                {/*            <FontAwesomeIcon style={{color: "#4169E1", width:"15px", height:"15px"}} icon={faComment} />*/}
                                {/*            <span style={{fontSize: "15px", color: "#4169E1", fontWeight:"bold", marginRight:"10px"}}>{data.replyCnt}</span>*/}
                                {/*        </span>*/}
                            </div><div align={"center"}><hr style={{width:"90%"}}/></div>

                        </>
                    );
                })
            }
            </Paper>
            <div style={{marginLeft:"184px", marginTop:"10px"}}>
            <Stack spacing={2}>
                <Pagination count={totalPage} showFirstButton showLastButton
                            defaultPage={ parseInt(page)} boundaryCount={3}
                            onChange={(e, value) =>
                            {
                                if(window.location.search === '') {window.location.href=`/contest/${value}`}
                                else{console.log("들어옴",searchWord);window.location.href=`/contest/${value}?search=${searchWord}`}
                            }}
                            onClick={(e,p) => {console.log(p);}}/>
            </Stack>
            </div>

        </>
    )
}

export default ContestMain;