import {Button, Container, Grid, Pagination, Stack} from "@mui/material";
import Paper from "@mui/material/Paper";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import AppBar from "@mui/material/AppBar";

function MyMoim(){
    const params = useParams();
    let [page, setPage] = useState(params.page);
    const navigate = useNavigate();
    const [state,updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});
    const [totalPage, setTotalPage] = useState('');
    const [moimList, setMoimList] = useState([]);
    const checkHere = (meetName) => {
        console.log("checkCheck: "+ meetName);
        window.location.href =`/meeting/${meetName}`
    }
    const getData = async (id) => {
        await axios.get(`/Moim/${id}/moim`, {
            params: {
                page: page,
            }
        })
            .then(res => {
                console.log(res.data);
                setMoimList(res.data.content);
                setTotalPage(res.data.totalPages);
            })
    }
    useEffect(()=>{
        const id = sessionStorage.getItem("id");
        if(parseInt(page) < 0 || isNaN(parseInt(page))) {
            console.log("0보다 작음",parseInt(page));
            navigate(`/myPage/myMoim/${1}`);
            page = 1;
            setPage(1);
            forceUpdate();
        }
        getData(id);
    },[])
    return(<>
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"830px" }} >
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>나의 모임</div>
            </AppBar>
            <Container>
                <Grid container spacing={1}>
                    {moimList.map(list => {

                        return(
                            <Grid item xs={3}>
                                <Paper elevation={4} sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }} style={{marginTop:"20px"}}>
                                    <Button style={{color:"black", fontSize:"16px"}}>
                                        <MeetingBoxContainer
                                            onClick={()=>{checkHere(list.meetName)}}>
                                            <span>
                                                <table>
                                                    <div style={{padding: 15}}>
                                                        <tbody>
                                                        <tr>
                                                            <div align='center'>
                                                                <img style={{height: "100%", width: "100%"}}
                                                                     src={list.img}/>
                                                            </div>
                                                        </tr>
                                                        <tr align={"center"}>
                                                            <div style={{paddingTop: 12}}>
                                                                <div style={{fontWeight:"bold"}}>{list.meetName}</div>
                                                            </div>
                                                        </tr>
                                                        </tbody>
                                                    </div>
                                                </table>
                                            </span>
                                        </MeetingBoxContainer>
                                    </Button>
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>

            </Container>
        </Paper>
        <div style={{paddingLeft:"40%" , paddingTop:"10px"}}>
            <Stack spacing={2}>
                <Pagination count={totalPage} showFirstButton showLastButton
                            defaultPage={ parseInt(page)} boundaryCount={3}
                            onChange={(e, value) =>
                            {
                                setPage(value);
                                window.location.href=`/myPage/myMoim/${value}`;
                            }}
                            onClick={(e,p) => {console.log(p);}}/>
            </Stack>
        </div>
    </>)
}
export default MyMoim;

let MeetingBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
`