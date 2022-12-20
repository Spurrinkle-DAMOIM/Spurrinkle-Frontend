import React, {useRef, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios';
import {Editor} from '@tinymce/tinymce-react';
import meeting from "../../pages/Moim/Meeting";
import {Paper, Button} from '@mui/material';
import Alert from 'sweetalert2';
import AppBar from "@mui/material/AppBar";
// import * as path from "path";

export default function Proceedings(props) {
    let con = '';
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);
    const editorRef = useRef(null);
    const location = window.location.href;
    const path = decodeURI(location.split("/")[4]);
    const date = new Date();
    const day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const time = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
    const procs = day+"T"+time;
    const [content, setContent] = useState(`<span style="font-family: &quot;맑은 고딕&quot;; font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <style>
    #approvalTable input {text-align:center}
</style>
    <table style="border: 0px solid rgb(0, 0, 0); border-image: none; width: 800px; font-family: malgun gothic, dotum, arial, tahoma; margin-top: 1px; border-collapse: collapse;"><!-- Header -->
        <colgroup>
            <col width="310">
                <col width="490">
        </colgroup>
        <tbody>
        <tr>
            <td style="background: white; padding: 0px !important; border: 0px currentColor; border-image: none; height: 65px; text-align: left; color: black; font-size: 30px; font-weight: bold; vertical-align: middle;" className="dext_table_border_t dext_table_border_r dext_table_border_b dext_table_border_l">
                &nbsp;회의록
            </td>
            <td style="background: white; padding: 0px !important; border: currentColor; border-image: none; text-align: right; color: black; font-size: 12px; font-weight: normal; vertical-align: top;">
            </td>
        </tr>
        </tbody>
    </table>
    <table id="approvalTable" style="border: 0px solid rgb(0, 0, 0); width: 800px; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; border-collapse: collapse; height: 20px;">
        <table style="border: 0px solid rgb(0, 0, 0); border-image: none; width: 800px; font-family: malgun gothic, dotum, arial, tahoma; border-collapse: collapse;">
        <colgroup>
            <col width="120">
                <col width="280">
                    <col width="120">
                        <col width="280">
        </colgroup>
            <tbody>
            <tr>
                <td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; border-image: none; height: 25px; text-align: center; color: rgb(0, 0, 0); font-size: 14px; font-weight: bold; vertical-align: middle;">
                    회의일자
                </td>
                <td style="background: rgb(255, 255, 255); padding: 5px; border: 1px solid black; border-image: none; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="6" data-dsl="{{text}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype=""><span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="6" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
            <tr>
                <td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; border-image: none; height: 25px; text-align: center; color: rgb(0, 0, 0); font-size: 14px; font-weight: bold; vertical-align: middle;">

                    작성자
                </td>
                <td style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="9" data-dsl="{{text}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype=""><span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="9" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
            <tr>
                <td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; border-image: none; height: 50px; text-align: center; color: rgb(0, 0, 0); font-size: 14px; font-weight: bold; vertical-align: middle;">

                    회의참석자
                </td>
                <td style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="10" data-dsl="{{text}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype=""><span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="10" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
            <tr>
                <td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; border-image: none; height: 25px; text-align: center; color: rgb(0, 0, 0); font-size: 14px; font-weight: bold; vertical-align: top;">

                    주제
                </td>
                <td style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="11" data-dsl="{{text:subject}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype=""><span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="11" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
            <tr>
                <td style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; height: 350px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: top;" colSpan="4" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="12" data-dsl="{{editor}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype=""><span class="comp_editor" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: 200px; margin-top: 0px; margin-bottom: 0px;"></span><span contentEditable="false" class="comp_active" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; display: none;"> <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span><span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="12" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
            </tbody>
        </table>
    </span>`
    );

    function saveContent(e) {
        setContent(e.target.getContent());
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const list = [];
        const obj = {
            title: "회의록",
            start: procs,
            proc: true,
            content: content,
        }
        list.push(obj);

        //회의록을 작성했는지 안 했는지 구분해 서버로 보낼 지 결정
        if(con === content){
            Alert.fire({
                html: "회의록을 작성해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
        } else {
            axios.post('/meeting/proceedings/write', {
                user: meetName,
                days: list
            })
                .then((res) => {
                    if (res.data === "T") {
                        Alert.fire({
                            html: "저장 성공하였습니다",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        }).then((res) => {
                            window.location.href = `/meeting/${path}/calendar`;
                        });
                    } else {
                        Alert.fire({
                            html: "저장에 실패하였습니다",
                            icon: "error",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        });
                    }
                })
        }
    };

    // url 검색으로 넘어오는거 막기
    const checkUserList = async () => {
        await axios.get(`/Moim/${meetName}/moimDetail`)
            .then(res => {
                if (!res.data.user.includes(sessionStorage.getItem("id"))) {
                    Alert.fire({
                        html: "모임 가입자만 이용하실 수 있습니다",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                    return;
                }
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        if(sessionStorage.getItem("id") === null){
            Alert.fire({
                html: "로그인이 필요합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            }) .then((res)=>{
                window.location.href = "/login";
            })
        } else {
            con = content;
        }
        checkUserList();
    }, []);
    
    return (
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight:"820px", height:"auto" }} >
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>회의록 작성</div>
            </AppBar>
            <form onSubmit={onSubmitHandler}>
                <div align={"center"}>
                    <Editor
                        onChange={saveContent}
                        apiKey=''
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={content}
                        init={{
                            width: 900,
                            height: 760,
                            menubar: false,
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
                <div align={"center"} style={{paddingTop: "20px", paddingBottom:"20px"}}>
                    <Button variant="contained"  onClick={onSubmitHandler} >저장</Button>
                </div>
            </form>
        </Paper>
    );
}