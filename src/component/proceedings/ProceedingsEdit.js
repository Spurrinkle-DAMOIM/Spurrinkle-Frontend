import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import {Editor} from '@tinymce/tinymce-react';
import {Paper, Button} from '@mui/material';
import Alert from "sweetalert2";

let data = {};
const ProceedingsEdit = (props) => {
    const editorRef = useRef(null);
    const [content, setContent] = useState('');
    const params = useParams();
    const meetName = params.meetName;
    props.meetName(meetName);
    const location = window.location.href;
    const path = decodeURI(location.split("/")[4]);

    useEffect( () => {
        const list = [];
        const obj = {
            id: params.id
        }
        list.push(obj);
        axios.post('/meeting/proceedings/edit', {
            user: meetName,
            days: list
        })
            .then( (res) => {
                data = res.data;
                setContent(res.data.days[0].content);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])


    function saveContent(e) {
        setContent(e.target.getContent());
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const list = [];
        const obj = {
            id: data.days[0].id,
            title: data.days[0].title,
            start: data.days[0].start,
            content: content,
            proc: data.days[0].proc
        }
        list.push(obj);
        axios.post('/meeting/proceedings/edit/save', {
            user: meetName,
            days: list
        })
            .then((res) => {
                if (res.data === "T") {
                    Alert.fire({
                        html: "수정 성공하였습니다",
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
    };

    return (
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight:"821px", height:"auto" }} >
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
                <div align={"center"} style={{paddingTop: 15}}>
                    <Button variant={"contained"} type="submit" onSubmit={onSubmitHandler}>저장</Button>
                </div>
            </form>
        </Paper>
    );
}

export default ProceedingsEdit;