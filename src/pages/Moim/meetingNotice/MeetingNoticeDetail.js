import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {Paper} from "@mui/material";
import Alert from "sweetalert2";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

export default function MeetingNoticeDetail(props) {
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);

    const annId = params.annId;
    const [datas, setDatas] = useState([]);
    const [leader, setLeader] = useState("");

    const getData = async () => {
        await axios.get(`/Moim/announcement/${annId}`)
            .then((res) => {
                if (res !== null) {
                    console.log(res.data);
                    setDatas(res.data);
                }
            })
    }

    const createMarkup = () => {
        return {__html: datas.content};
    }

    const checkLeader = async () => {
        await axios.get(`/Moim/${meetName}/leader`)
            .then(res => {
                setLeader(res.data);
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getData();
        checkLeader();
    }, []);

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "821px", height:"auto"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            ><div align={"left"} style={{paddingLeft:"20px", margin:"18px", fontSize:"30px", fontWeight:"bold"}}>공지사항</div></AppBar>
            <div style={{paddingTop: 20}}>
                <div style={{ fontSize: "25px"}}>
                    <strong>{datas.title}</strong>
                </div>
                <div>
                    <hr style={{width: "90%"}}/>
                </div>
                <div dangerouslySetInnerHTML={createMarkup()}/>
            <div style={{paddingTop: 20}}>
                {
                    leader === sessionStorage.getItem("id")
                        ? <Button  variant={"contained"}
                                 onClick={() => {
                                     window.location.href = `/meeting/${meetName}/notice/${annId}/update`
                                 }}>수정</Button>
                        : null
                }
                &nbsp;&nbsp;&nbsp;
                <Button variant={"contained"} onClick={() => {
                    window.location.href = `/meeting/${meetName}/notice`
                }}>목록</Button>
            </div>
        </div>
</Paper>
)
    ;
}