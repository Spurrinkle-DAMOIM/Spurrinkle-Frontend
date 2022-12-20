import {Grid} from "@mui/material";
import React from "react";
import {Paper, Button} from "@mui/material";

export default function profile() {
    return (
        <>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto" }} >

                <div  style={{width: 200}}>
                    <div align='center' style={{paddingTop: 10}}>
                        <img style={{height: "80%", width: "80%", marginTop: "20px"}}
                             src={"https://frameworklab.imweb.me/common/img/default_profile.png"}/>
                    </div>
                    <div align={'center'} style={{paddingTop: 30, paddingBottom: 20}}>
                        <Button value='회원가입' onClick={() => {
                            window.location.href = '/join'
                        }}/> &nbsp;
                        <Button value='로그인' onClick={() => {
                            window.location.href = '/login'
                        }}/>
                    </div>
                </div>
            </Paper>
        </>
    )
}