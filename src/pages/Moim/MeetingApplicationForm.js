import React, {useRef, useState} from 'react';
import axios from 'axios';
import {Editor} from '@tinymce/tinymce-react';
import {useParams} from "react-router-dom";
import {Paper, Button} from "@mui/material";
import Alert from 'sweetalert2';
import AppBar from "@mui/material/AppBar";

export default function MeetingApplicationForm() {
    const params = useParams();
    const meetName = params.meetName;
    const editorRef = useRef(null);
    const [content, setContent] = useState(`<span style="font-family: &quot;맑은 고딕&quot;; font-size: 10pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"> <style>
    #approvalTable input {text-align:center}
</style>

    <table style="border: 0px solid rgb(0, 0, 0); border-image: none; width: 800px; font-family: malgun gothic, dotum, arial, tahoma; margin-top: 1px; border-collapse: collapse;">
        <colgroup>
            <col width="310">
                <col width="490">
        </colgroup>

        <tbody>
        <tr>
            <td style="background: white; padding: 0px !important; border: 0px currentColor; border-image: none; height: 65px; text-align: left; color: black; font-size: 30px; font-weight: bold; vertical-align: middle;" className="dext_table_border_t dext_table_border_r dext_table_border_b dext_table_border_l">
                &nbsp;신청서
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
                    학교/학년
                </td>
                <td style="background: rgb(255, 255, 255); padding: 5px; border: 1px solid black; border-image: none; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="6" data-dsl="{{text}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype="">
                    <span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span></span>
                    <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="6" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a></span></span><br>
                </td>
            </tr>
            <tr>
                <td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; border-image: none; height: 25px; text-align: center; color: rgb(0, 0, 0); font-size: 14px; font-weight: bold; vertical-align: middle;">
                    이름
                </td>
                <td style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="9" data-dsl="{{text}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype="">
                    <span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="9" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
            <tr>
                <td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; border-image: none; height: 50px; text-align: center; color: rgb(0, 0, 0); font-size: 14px; font-weight: bold; vertical-align: middle;">
                    지원동기
                </td>
                 <td style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: middle;" colSpan="3" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="9" data-dsl="{{text}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype="">
                    <span contentEditable="false" class="comp_active" style="display: none; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span> </span> <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="9" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a> </span> </span><br>
                </td>
            </tr>
           <tr>
                <td colspan="8" style="background: rgb(255, 255, 255); border-width: medium 1px 1px; border-style: none solid solid; border-color: currentColor black black; padding: 5px; height: 400px; text-align: left; color: rgb(0, 0, 0); font-size: 14px; font-weight: normal; vertical-align: top;" colSpan="4" className="dext_table_border_t">
                    <span unselectable="on" contentEditable="false" class="comp_wrap" data-cid="12" data-dsl="{{editor}}" data-wrapper="" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;" data-value="" data-autotype="">
                    <span class="comp_editor" style="width: 100%; font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: 200px; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span contentEditable="false" class="comp_active" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px; display: none;"> <span class="Active_dot1" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot2" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot3" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span>
                    <span class="Active_dot4" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;"></span></span>
                    <span contentEditable="false" class="comp_hover" data-content-protect-cover="true" data-origin="12" style="font-family: &quot;malgun gothic&quot;, dotum, arial, tahoma; font-size: 11pt; line-height: normal; margin-top: 0px; margin-bottom: 0px;">
                    <a contentEditable="false" className="ic_prototype ic_prototype_trash" data-content-protect-cover="true" data-component-delete-button="true"></a></span></span><br>
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
        console.log(content);
        const com = window.confirm("해당 모입에 가입 신청서를 제출하시겠습니까?")
        if(!com){return;}

        e.preventDefault();
        const list = [];
        const today = new Date();
        const mon = (today.getMonth() + 1).length < 2 ? "0"+(today.getMonth() + 1) : (today.getMonth() + 1);
        const day = String(today.getDate()).length < 2 ? "0"+today.getDate() : today.getDate();
        const obj = {
            userId: sessionStorage.getItem('id'),
            content: content,
            meetName,
            date: today.getFullYear() + "-" + mon + "-" + day,
        }
        console.log(obj);
        axios.post('/Moim/apllicant', obj)
            .then((res) => {
                if (res.data !== "fail") {
                    Alert.fire({
                        html: "신청 완료되었습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res)=>{
                        window.location.href = `/meetings/1`;
                    });
                } else {
                    Alert.fire({
                        html: "신청이 불가합니다",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
    };

    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "auto"}}>
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"30px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"30px"}}>{meetName} 신청서</div>
            </AppBar>
            <div align={"center"}>
                <Editor
                    onChange={saveContent}
                    apiKey=''
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={content}
                    init={{
                        width: 865,
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
            <div align={"center"} style={{paddingTop: 20, paddingBottom:20}}>
                <Button variant={"contained"} onClick={onSubmitHandler} >제출</Button>
                &nbsp;&nbsp;
                <Button variant={"contained"} style={{backgroundColor:"darkred"}} onClick={()=>{window.history.back()}} >뒤로</Button>
            </div>
        </Paper>
    );
}