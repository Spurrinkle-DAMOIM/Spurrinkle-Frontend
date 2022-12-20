import * as React from 'react';
import {
    MenuItem, FormControl, Select, Stack, Button, InputBase,
    Grid, InputLabel, Pagination, Container, Paper, AppBar, Box
} from '@mui/material';
import {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import CustomizedInputBase from "../CustomizedInputBase.js";
import {useParams} from "react-router-dom";

function MeetingMain() {
    const [moimList, setMoimList] = useState([]);
    const [totalPage, setTotalPage] = useState()
    const params = useParams();
    const moimPage =params.page ;
    const searchWord = window.location.search.split('=')[1];

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
        // axios
    };

    const checkHere = (meetName) => {
        console.log("checkCheck: "+ meetName);
        window.location.href =`/meeting/${meetName}`
    }

    useEffect(()=>{
        axios.get("/Moim/MoimList",{
            params:{
                page:moimPage
            }
        })
            .then((res)=> {
                console.log("모임: ", res.data);
                setMoimList(res.data.content);
                setTotalPage(res.data.totalPages);
            })
    }, [])
    const onClickSearch = (e) => {
        const search = document.getElementsByName("searchBoard")[0].value;
        window.location.href=`/meeting/${1}?search=${search}`
    }


    useEffect(()=>{
        const searchCheck = decodeURI(window.location.search).split('=')[1];
        console.log("searchCheck: "+ searchCheck);
        if(searchCheck === undefined) {
            console.log('검색어 없음');
            axios.get("/Moim/MoimList",{
                params:{
                    page:moimPage
                }
            })
                .then((res)=>{
                    console.log(res.data);
                    setMoimList(res.data.content);
                    setTotalPage(res.data.totalPages);
                })
        }else{
            console.log('검색어 있음');
            axios.get("/Moim/MoimList/search",{
                params:{
                    page:moimPage,
                    search: decodeURI(searchCheck),
                }
            })
                .then((res)=>{
                    console.log(res.data);
                    setMoimList(res.data.content);
                    setTotalPage(res.data.totalPages);
                })
        }


    },[])




    function create(){
        window.location.href = "/meetings/createMoim";
    }
    return (
        <>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"700px" }} >
                <AppBar
                    position="static"
                    color="default"
                    //
                    style={{backgroundColor:"#DAE6F1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <div align={"left"} style={{fontFamily:"ImcreSoojin", paddingLeft:"30px", fontSize:"30px"}}>
                        <div style={{color:"#FFF7EF", paddingTop:"10px",paddingBottom:"10px"}}>
                            모임에 참여하세요!
                            <span style={{paddingLeft:"470px"}}>
                                <Button variant="contained" style={{backgroundColor:"#578EC3"}}   onClick={create}>모임 만들기</Button>
                            </span>
                        </div>
                        <div style={{paddingBottom:"20px"}}>

                            <Container>
                                <Grid container spacing={1}>
                                    {/*<Grid item xs={2}>*/}
                                    {/*    <Box sx={{ minWidth: 120 }}>*/}
                                    {/*        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">*/}
                                    {/*            <InputLabel id="demo-select-small">카테고리</InputLabel>*/}
                                    {/*            <Select*/}
                                    {/*                style={{backgroundColor:"white"}}*/}
                                    {/*                labelId="demo-select-small"*/}
                                    {/*                id="demo-select-small"*/}
                                    {/*                label="Age"*/}
                                    {/*                onChange={handleChange}*/}
                                    {/*            >*/}
                                    {/*                <MenuItem value={"전체"}>전체</MenuItem>*/}
                                    {/*                <MenuItem value={"취미"}>취미</MenuItem>*/}
                                    {/*                <MenuItem value={"스터디"}>스터디</MenuItem>*/}
                                    {/*                <MenuItem value={"공모전"}>공모전</MenuItem>*/}
                                    {/*                <MenuItem value={"사교/인맥"}>사교/인맥</MenuItem>*/}
                                    {/*                <MenuItem value={"기타"}>기타</MenuItem>*/}
                                    {/*            </Select>*/}
                                    {/*        </FormControl>*/}
                                    {/*    </Box>*/}
                                    {/*</Grid>*/}
                                    <Grid item xs={12}>
                                        <div style={{marginTop:"8px"}}><CustomizedInputBase/></div>
                                    </Grid>
                                </Grid>
                            </Container>
                        </div>
                    </div>


                </AppBar>
                <Container>
                    <Grid container spacing={1}>
                        {moimList.map(list => {

                            return(
                                <Grid item xs={3}>
                                    <Paper elevation={4} sx={{ maxWidth: 936, height:"250px", margin: 'auto', overflow: 'hidden' }} style={{marginTop:"20px"}}>
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


            <span >
                <Stack style={{paddingLeft:"340px", paddingTop:"20px"}} spacing={2}>
                    <Pagination
                        count={totalPage}
                        showFirstButton
                        showLastButton
                        defaultPage={ parseInt(moimPage)}
                        boundaryCount={3}
                        onChange={(e, value) => {
                            window.location.href=`/meetings/${value}`}}
                        onClick={(e,p) => {console.log(p);}}/>
                </Stack>
            </span>
        </>
    );
}

export default MeetingMain;

let MeetingBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
`