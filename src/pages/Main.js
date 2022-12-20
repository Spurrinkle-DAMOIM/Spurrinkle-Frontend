import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Container from "@mui/material/Container";
import {Grid} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import LatestPost from "../component/Board/LatestPost.js";
import PopuBoard from "../component/Board/PopuBoard";
import ContestList from "../component/Board/ContestList.js";
import Alert from "sweetalert2";

function Main() {
    const [hello, setHello] = useState('')
    const id = sessionStorage.getItem('id');
    const uni = sessionStorage.getItem("id") === null ? null : JSON.parse(sessionStorage.getItem('user')).uniName

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => setHello(response.data))
            .catch(error => console.log(error))
    }, []);

    return (
        <div>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "740px"}}>
                                    <AppBar
                                        position="static"
                                        color="default"
                                        style={{backgroundColor: "#dae6f1"}}
                                        elevation={0}
                                        sx={{borderBottom: '2px solid rgba(0, 0, 0, 0.12)'}}
                                    >
                                        <Toolbar>
                                            <Button style={{color: "black", fontSize: "24px", fontWeight: "bolder"}}
                                                    onClick={() => {
                                                        if (id === null) {
                                                            Alert.fire({
                                                                html: "로그인이 필요합니다",
                                                                icon: "warning",
                                                                confirmButtonColor: "#1976D2",
                                                                confirmButtonText: "확인"
                                                            });
                                                        } else {
                                                            window.location.href = `/boardMain/${JSON.parse(sessionStorage.getItem("user")).uniName}/1`
                                                        }
                                                    }}
                                            >
                                                자유게시판
                                            </Button>
                                        </Toolbar>
                                    </AppBar>
                                    <Typography style={{marginTop:"20px"}} color="text.secondary" align="center">
                                        <LatestPost uni={uni} />
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"366px"}}>
                                    <AppBar
                                        position="static"
                                        color="default"
                                        elevation={0}
                                        sx={{borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}
                                    >
                                        <Toolbar style={{fontWeight: "bold", backgroundColor: "#dae6f1"}}>
                                            금주의 HOT 게시판
                                        </Toolbar>
                                    </AppBar>
                                    <Typography style={{marginTop:"20px"}} color="text.secondary" align={"center"}>
                                        <PopuBoard uni={uni} /> {/*핫 게시판 컴포넌트*/}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"366px" }}>
                                    <AppBar
                                        position="static"
                                        color="default"
                                        elevation={0}
                                        sx={{borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}
                                    >
                                        <Toolbar style={{backgroundColor:"#dae6f1"}}>
                                            <Button style={{color:"black", fontWeight:"bold", fontSize:"16px"}}
                                                    onClick={()=>{window.location.href=`/contest/1`}}> 공모전 여기 다모임!</Button>
                                        </Toolbar>
                                    </AppBar>
                                    <Typography style={{marginTop:"20px"}}  color="text.secondary" align="center">
                                        <ContestList/>
                                    </Typography>
                                </Paper>
                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Main;