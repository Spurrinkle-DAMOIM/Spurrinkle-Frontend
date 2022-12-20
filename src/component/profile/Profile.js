import {Grid} from "@mui/material";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Paper, Button} from "@mui/material";

function Profile() {
    const [name, setName] = useState('');
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if(sessionStorage.getItem("id") !== null) {
            axios.post('/user/profile', {
                id: sessionStorage.getItem('id'),
            })
                .then((res) => {
                    setName(res.data.name);
                    setNick(res.data.nickname);
                    setEmail(res.data.email);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    if (sessionStorage.getItem('id') !== null) {
        return (
            <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden'}}>
                <div style={{width: 200}}>
                    <div align='center' style={{paddingTop: 10}}>
                        <img style={{height: "80%", width: "80%", marginTop: "20px"}}
                             src={sessionStorage.getItem("user") === null ?
                                 "https://frameworklab.imweb.me/common/img/default_profile.png" : JSON.parse(sessionStorage.getItem("user")).img}/>
                    </div>
                    <div align='center'
                         style={{fontSize: '20px', marginBottom: '5px', fontWeight: 'bold', paddingTop: 10}}>
                        {nick}
                    </div>
                    <div align={'center'} style={{paddingTop: 3, paddingBottom: 5}}>
                        {name}
                    </div>
                    <div align={'center'} style={{fontSize: '15px', marginBottom: '15px'}}>
                        {email}
                    </div>
                    <div align={'center'} style={{paddingBottom: 15, marginBottom: "10px"}}>
                        <Button variant="contained" onClick={() => {
                            sessionStorage.clear();
                            window.location.href = ("/login");
                        }}>로그아웃</Button>
                    </div>
                </div>
            </Paper>
        )
    } else {
        return (
            <Grid item xs={12}>
                <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto" }} >
                <table>
                    <div>
                        <div align='center'>
                            <img style={{height: "100%", width: "100%", marginTop:"20px"}}
                                 src={"https://frameworklab.imweb.me/common/img/default_profile.png"}/>
                        </div>
                        <div align={'center'} style={{paddingTop: 25, paddingBottom: 20}}>
                            <Button variant="contained" onClick={() => {
                                window.location.href = '/join'
                            }}>회원가입</Button> &nbsp;
                            <Button variant="contained" onClick={() => {
                                window.location.href = '/login'
                            }}>로그인</Button>
                        </div>
                    </div>
                </table>
                </Paper>
            </Grid>
        )
    }
}

export default Profile;