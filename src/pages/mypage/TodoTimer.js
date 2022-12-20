import React, {useState} from "react";
import DatePicker from "react-datepicker";
import dayjs from 'dayjs';
import TodoTemplate from '../../component/todo/TodoTemplate.js';
import "react-datepicker/dist/react-datepicker.css";
// import Timer from "../timer/Timer";
import Timer from "../../pages/timer/Timer.js";
import {Grid, Paper} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";

const TodoTimer = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [timerCheck, setTimerCheck] = useState("today");
    const date = document.getElementsByName("datePick")[0];
    console.log("startDate: ", startDate)
    console.log("timerCheck: ", timerCheck)
    if (date !== undefined) {
        console.log("선택: ", date.value)
    }
    return (
        <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight:"830px" }} >
            <AppBar
                position="static"
                color="default"
                style={{backgroundColor:"#dae6f1"}}
                elevation={0}
                sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
            >
                <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"8px" ,fontWeight:"bold", fontSize:"34px"}}>스터디 통계</div>

                <div align={"left"} style={{marginLeft:"60px", marginBottom:"10px"}}><DatePicker
                    dateFormat={"yyyy-MM-dd"}
                    selected={startDate}
                    name={"datePick"}
                    maxDate={new Date()}
                    onChange={date => {
                        setStartDate(date);
                        setTimerCheck(dayjs(date).format("YYYY-MM-DD"))
                    }}/></div>

            </AppBar>

            <Container fixed>
                <Paper style={{backgroundColor:"lightsteelblue", marginTop:"30px", marginBottom:"20px"}}>
                <Grid container spacing={1}>
                    <Grid item xs={5}>

                        <div style={{marginTop:"20px", marginLeft:"20px"}}><TodoTemplate date={startDate}/></div>

                    </Grid>
                    <Grid item xs={7}>
                        <Card style={{marginRight:"20px", marginTop:"20px"}}>

                        <Timer url={"TimeCheck"} date={timerCheck}/>
                        </Card>
                    </Grid>
                </Grid>
                <br/>
                </Paper>
            </Container>








            {/*<table>*/}
            {/*    <tbody>*/}
            {/*    /!*<tr align={"center"}>*!/*/}
            {/*    /!*    <td colSpan={2}>*!/*/}
            {/*    /!*        *!/*/}
            {/*    /!*    </td>*!/*/}
            {/*    /!*</tr>*!/*/}
            {/*    <tr>*/}
            {/*        <td style={{verticalAlign:"top", paddingTop:60}}>*/}
            {/*            <TodoTemplate/>*/}
            {/*        </td>*/}
            {/*        <td align={"center"}>*/}
            {/*            <Timer url={"TimeCheck"} date={timerCheck}/>*/}
            {/*        </td>*/}
            {/*    </tr>*/}
            {/*    </tbody>*/}
            {/*</table>*/}
        </Paper>
    );
};

export default TodoTimer;