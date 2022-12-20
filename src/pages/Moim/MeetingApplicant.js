import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Editor} from "@tinymce/tinymce-react";
import {Button, Paper} from "@mui/material"
import {useParams} from "react-router-dom";
import {leaderCheck} from "../../component/userCheck/MoimCheck";
import AppBar from "@mui/material/AppBar";

function MeetingApplicant() {
    const params = useParams();
    const meetName = params.meetName;
    const userId = params.userId;
    const [datas, setDatas] = useState([]);

    const getData = async () => {
        await axios.get(`/Moim/applicant/${meetName}/${userId}`)
            .then((res) => {
                if (res !== null) {
                    console.log(res.data);
                    setDatas(res.data);
                }
            })
    }
    useEffect(() => {
        const id = sessionStorage.getItem("id");
        leaderCheck(meetName, id);
        getData();
    }, [])

    const onClickSubmit = async () => {
        const com = window.confirm("해당 유저의 가입을 수락하시겠습니까?")
        if(!com){return;}
        await axios.get(`/Moim/applicantSubmit/${datas.meetName}/${datas.id}`)
            .then((res) => {
                console.log(res.data);
                if (res.data !== null) {
                    window.location.href = `/meeting/${datas.meetName}`;
                } 
            })
    }
    const onClickReject = async ()=>{
        const com = window.confirm("가입 거절시 해당 유저의 신청서가 삭제됩니다. 가입을 거절하시겠습니까?")
        if(!com){return;}
        const obj = {
            meetName: datas.meetName,
            appliID: datas.id,
            userID: datas.userId,
        }
        console.log(obj);
        await axios.post(`/Moim/applicant/reject`, obj)
            .then((res) => {
                console.log(res.data);
                console.log(datas.meetName);
                if (res.data !== "fail") {
                    window.location.href = `/meeting/${datas.meetName}`;
                }
            })
    }
    const createMarkup = () => {
        return {__html: datas.content};
    }

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "821px"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"30px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"30px"}}>신청자 관리</div>
            </AppBar>
            {/*res.data.days[0].content +*/}
            <div dangerouslySetInnerHTML={createMarkup()} />
            <div style={{paddingTop:40}}>
                <Button variant="contained" onClick={onClickSubmit}>가입 수락</Button>{/*이거 누르면 모달창으로 뜨게꿈 해줘*/}
                <Button variant="contained" onClick={onClickReject}
                    style={{marginLeft:"14px", backgroundColor:"darkred"}}>가입 거절</Button>
            </div>
        </Paper>
    );
};
export default MeetingApplicant;