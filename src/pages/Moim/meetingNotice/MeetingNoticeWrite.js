import React, {useEffect, useRef, useState} from "react";
import axios from 'axios';
import {useParams} from "react-router-dom";
import {Paper} from "@mui/material";
import {Editor} from '@tinymce/tinymce-react';
import {leaderCheck} from "../../../component/userCheck/MoimCheck.js";
import dayjs from "dayjs";
import Alert from "sweetalert2";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

export default function MeetingNoticeWriter(props) {
    let con = '';
    const params = useParams();
    const meetName = params.meetName;
    const annId = params.annId;
    props.meetName(meetName);
    const editorRef = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState({});

    function saveContent(e) {
        const con = replaceLineBreaks(e.target.getContent());
        setContent(con);
    }

    function replaceLineBreaks(data) {
        return data.replaceAll("\n", "<br/>");
    }

    const writeAnnou = async (ann) => {
        console.log("writeAnn");
        await axios.post(`/Moim/writeAnn`, ann)
            .then(res => {
                if (res.data !== "fail") {
                    Alert.fire({
                        html: "공지사항 작성이 완료되었습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res)=>{
                        console.log("res",res.data)
                        window.location.href = `/meeting/${meetName}/notice/`;
                        // window.location.href = `/meeting/${meetName}/notice/${res.data}`;
                    });
                }
            })
            .catch(error => console.log(error))
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const title = document.getElementsByName("title")[0].value;
        if (title === "") {
            Alert.fire({
                html: "제목을 작성해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (content === "") {
            Alert.fire({
                html: "공지사항을 작성해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        setTitle(title);
        const announcement = {
            meetName,
            title,
            userId: sessionStorage.getItem("id"),
            content,
            date: dayjs(new Date()).format("YYYY-MM-DD"),
        }
        console.log(announcement);
        writeAnnou(announcement);
    }

    // 공지사항 수정
    const updateAnn = async () => {
        await axios.get(`/Moim/announcement/${annId}/update`)
            .then(res => {
                if (res.data !== null) {
                    setUser(res.data);
                    con = res.data.content;
                }
            })
            .catch(error => console.log(error))
    }

    const onUpdateHandler = async () => {
        const title = document.getElementsByName("title")[0].value;
        if (title === "") {
            Alert.fire({
                html: "제목을 작성해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if(con === content) {
            console.log(con, "  , ", content);
            Alert.fire({
                html: "변경사항이 없습니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.post(`/Moim/announcement/${annId}/updateData`, {content, title})
            .then(res => {
                if (res.data !== "fail") {
                    Alert.fire({
                        html: "공지사항이 수정되었습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((response)=>{
                        window.location.href = `/meeting/${meetName}/notice/${annId}`;
                    });
                }
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        const id = sessionStorage.getItem("id");
        leaderCheck(meetName, id);
        if (props.url === "update") {
            updateAnn();
        }
    }, []);

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "auto", minHeight:"688px"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            ><div align={"left"} style={{paddingLeft:"20px", margin:"18px", fontSize:"30px", fontWeight:"bold"}}>공지사항 작성</div></AppBar>
            {
                props.url !== "update"
                    ? <>
                        <div style={{paddingTop: "20px"}}>
                            <input
                                id="title"
                                name={"title"}
                                placeholder={"제목"}
                                variant="standard"
                                inputProps={{style: {fontSize: 20}}}
                                defaultValue={title}
                                style={{
                                    outline:"none",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    borderBottom: "1px solid black",
                                    fontSize: 20,
                                    width: "90%",

                                }}
                            />
                        </div>
                        <div align={"center"} style={{paddingTop: 30}}>
                            <Editor
                                onChange={saveContent}
                                apiKey=''
                                // onInit={(evt, editor) => editorRef.current = editor}
                                init={{
                                    width: 865,
                                    height: 680,
                                    menubar: false,force_br_newlines : true,
                                    force_p_newlines : false,
                                    forced_root_block : '',
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </div>
                        <div align={"center"} style={{padding: 12}}>
                            <Button variant={"contained"}
                                   onClick={onSubmitHandler}
                                   >저장</Button>
                        </div>
                    </>
                    : <>
                        <div style={{paddingTop: "20px"}}>
                            <input
                                id="title"
                                name={"title"}
                                placeholder={"제목"}
                                variant="standard"
                                inputProps={{style: {fontSize: 20}}}
                                defaultValue={user.title}
                                style={{
                                    outline:"none",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    borderBottom: "1px solid black",
                                    fontSize: 20,
                                    width: "90%"
                                }}
                            />
                        </div>
                        <div align={"center"} style={{paddingTop: 30}}>
                            <Editor
                                onChange={saveContent}
                                apiKey=''
                                // onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={user.content}
                                init={{
                                    width: 865,
                                    height: 680,
                                    menubar: false,
                                    // force_br_newlines : true,
                                    // force_p_newlines : false,
                                    // forced_root_block : '',
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </div>
                        <div align={"center"} style={{paddingTop: 16, paddingBottom:16}}>
                            <Button variant={"contained"}
                                   onClick={onUpdateHandler}
                                   >수정</Button>
                        </div>
                    </>
            }
        </Paper>
    );
}