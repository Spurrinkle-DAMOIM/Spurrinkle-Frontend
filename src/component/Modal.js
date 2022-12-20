import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import {useState} from "react";
import TextField from '@mui/material/TextField';
import axios from "axios";
import Alert from 'sweetalert2';

function SubModal({open, setPopup, title, callback}) {
    const [times, setTimes] = useState([1]);
    const week = ["월", "화", "수", "목", "금"];
    const handleClose = () => {
        setPopup({open: false});
        setTimes([1]);
        if(callback){
            callback();
        }
    }
    const AddSub = async (subName, professor, place) => {
        let date = new Date();
        console.log(date.getMonth()+"월");
        if(date.getMonth()+1 < 9){
            date = date.getFullYear() + "-1학기";
        }else{
            date = date.getFullYear() + "-2학기";
        }
        const now = new Date();
        const id = sessionStorage.getItem("id");

        const day = document.getElementsByName("day");
        const start = document.getElementsByName("start");
        const end = document.getElementsByName("end");

        const subject = {
            subName,
            professor,
            place,
            days: [],
        };

        const days = [];
        for(var i = 0; i < day.length; i++) {
            const data = {
                day: day[i].value,
                start: start[i].value,
                end: end[i].value,
            };
            await axios.post(`/timeTable/days`, data)
                .then((res) => {
                    if (res.data !== "fail") {
                        subject.days.push(res.data);
                    }
                });
        }
        await axios.post(`/timeTable/${id}/${date}`, subject)
            .then((res) => {
                if (res.data !== "fail") {

                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                }
            });
    }
    const onClickSubmit = async (e) => {
        const subName = document.getElementsByName("subName")[0].value;
        console.log(subName);
        const professor = document.getElementsByName("professor")[0].value;
        const place = document.getElementsByName("place")[0].value;
        const start = document.getElementsByName("start")[0].value;
        const end = document.getElementsByName("end")[0].value;
        if (subName === "") {
            Alert.fire({
                html: "수업명을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })
            return;
        }
        if (professor === "") {
            Alert.fire({
                html: "교수명을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })
            return;
        }
        if(start === "" || end === ""){
            Alert.fire({
                html: "시간을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })
            return;
        }
        await AddSub(subName, professor, place);
        handleClose();
    }
    return (
        <>
            <Modal show={open} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <ModalDiv>
                    <Form.Label>수업명</Form.Label>
                    <Form.Control type="text" placeholder="수업명" name={"subName"}/>
                    <Form.Label>교수명</Form.Label>
                    <Form.Control type="text" placeholder="교수명" name={"professor"}/>
                    <Form.Label>장소</Form.Label>
                    <Form.Control type="text" placeholder="장소" name={"place"}/>
                    {
                        times.map(t => {
                            return(
                                <>
                                    <ModalDiv>
                                        <TimeDiv>
                                            <TimeSelect name={"day"}>
                                                {
                                                    week.map(w => {
                                                        return(<>
                                                            <option value={w}>{w}</option>
                                                        </>);
                                                    })
                                                }
                                            </TimeSelect>
                                            <TextField style={{marginLeft: "14px"}}
                                                id="time"
                                                type="time"
                                                defaultValue="09:00"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ width: 160 }}
                                                name={"start"}
                                            />
                                            <span>&nbsp;~&nbsp;</span>
                                            <TextField style={{marginLeft: "14px"}}
                                                id="time"
                                                type="time"
                                                defaultValue="09:00"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                sx={{ width: 160 }}
                                                name={"end"}
                                            />
                                        </TimeDiv>
                                    </ModalDiv>
                                </>
                            );
                        })
                    }
                    <TimeButton
                        onClick={()=>{setTimes([...times, 1])}}
                    >시간 추가</TimeButton>
                </ModalDiv>
                <Modal.Footer>
                    <Button variant="info" onClick={(e)=>{onClickSubmit(e)}} style={{color:"white"}}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SubModal;

let ModalDiv = styled.div`
    width: 440px;
    margin: 10px auto;
`
let TimeButton = styled.button`
    border: none;
    outline: none;
    background-color: white;
    margin: 10px 0px;
    color: #6495ED;
    font-weight: bold;
`
let TimeDiv = styled.div`
    margin: 10px 0px;
    display: flex;
`
let TimeSelect = styled.select`
    width: 80px;
    textAlign: center;
    border-radius: 4px;
    text-align: center;
    border-color: lightgray;
`