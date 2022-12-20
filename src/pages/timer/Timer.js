import React, {useCallback, useEffect, useRef, useState} from 'react';
import {faDeleteLeft, faPen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Time from "../../component/timer/Time.js";
import axios from "axios";
import Chart from "../../component/chart/Chart.js";
import BarChart from "../../component/chart/BarChart.js";
import {Paper, Grid, Container, TextField, TableHead, TableRow, TableCell, TableBody, Table} from "@mui/material";
import Alert from 'sweetalert2';
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const useCounter = (initialValue, ms) => {
    const [count, setCount] = useState(initialValue);
    const intervalRef = useRef(null);
    const start = useCallback(() => {
        if (intervalRef.current != null) {
            return;
        }
        intervalRef.current = setInterval(() => {
            setCount(c => c + 1);
        }, ms);
    }, []);
    const stop = useCallback(() => {
        if (intervalRef.current === null) {
            return;
        }
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);
    const reset = useCallback(() => {
        setCount(0);
        stop();
    }, []);
    return {count, start, stop, reset, setCount};
}
const useCounter2 = (initialValue, ms) => {
    const [count2, setCount2] = useState(initialValue);
    const intervalRef = useRef(null);
    const start2 = useCallback(() => {
        if (intervalRef.current != null) {
            return;
        }
        intervalRef.current = setInterval(() => {
            setCount2(c => c + 1);
        }, ms);
    }, []);
    const stop2 = useCallback(() => {
        if (intervalRef.current === null) {
            return;
        }
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);
    const reset2 = useCallback(() => {
        setCount2(0);
        stop2();
    }, []);
    return {count2, start2, stop2, reset2, setCount2};
}


function Timer(props) {
    const [currentHours, setCurrentHours] = useState([]);
    const [currentMinutes, setCurrentMinutes] = useState([]);
    const [currentSeconds, setCurrentSeconds] = useState([]);
    const {count, start, stop, reset, setCount} = useCounter(0, 1000);
    const {count2, start2, stop2, reset2, setCount2} = useCounter2(0, 1000);
    const [countArr, setCountArr] = useState([]);
    const [subjects, setSubject] = useState(["과목1"]);
    const [index, setIndex] = useState(1);          // 과목 인덱스
    const [modifyBoo, setModifyBoo] = useState(-1); // 수정 여부
    const [startTime, setStartTime] = useState("");
    const [calTime, setCalTime] = useState([]);
    const [subTimeArr, setsubTimeArr] = useState([]);
    const [propsData, setPropsData] = useState(props.date);

    // count의 변화에 따라 timer 함수 렌더링
    useEffect(() => {
        init(count, index);
        init(count2, 0);
    }, [count, count2]);
    useEffect(() => {
        userCheck();
    }, []);
    useEffect(() => {
        if (props.url === "TimeCheck") {
            userCheck();
        }
    }, [props.date]);
    // 타이머 기능
    const init = (count, index) => {
        const checkMinutes = Math.floor(count / 60);
        const hours = Math.floor(count / 3600);
        const minutes = checkMinutes % 60;
        const seconds = count % 60;
        currentHours[index] = Number(hours);
        currentMinutes[index] = Number(minutes);
        currentSeconds[index] = Number(seconds);
        setCurrentHours(currentHours);
        setCurrentMinutes(currentMinutes);
        setCurrentSeconds(currentSeconds);
        calTime[index] = hours > 0 ? hours + "H  " : "";
        calTime[index] = minutes > 0 ? minutes + "M  " : "";
        calTime[index] = seconds > 0 ? seconds + "S  " : "";
        setCalTime(calTime);
    }
    const onClickModiSub = async (sub, index, boo) => {
        if (boo === false) {
            setModifyBoo(index);
        } else {
            const content = document.getElementsByName("modifySub")[0].value;
            if (content === subjects[index]) {
                setModifyBoo(-1);
                return;
            }
            if (subjects.includes(content)) {
                Alert.fire({
                    html: "이미 해당 과목이 존재합니다",
                    icon: "warning",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                });
                document.getElementsByName("modifySub")[0].value = "";
                return;
            }
            const obj = {
                id: sessionStorage.getItem("id"),
                index: index,
                content,
            };
            await axios.post(`/timer/modiSub`, obj)
                .then(res => {
                    if (res.data !== "fail") {
                        setSubject(res.data);
                    } else {
                        Alert.fire({
                            html: "DB 에러",
                            icon: "warning",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        });
                    }
                })
                .catch(error => console.log(error));
            setModifyBoo(-1);
        }
    }
    const onClickDelSub = async (sub, index) => {
        if (subjects.length === 1) {
            Alert.fire({
                html: "최소 1과목 이상은 존재해야 합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        setModifyBoo(-1)
        const obj = {
            id: sessionStorage.getItem("id"),
            index: index,
        };
        await axios.post(`/timer/delSub`, obj)
            .then(async res => {
                if (res.data !== "fail") {
                    await getData();
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const userCheck = async () => {
        const id = sessionStorage.getItem("id");
        if (id === null) {
            Alert.fire({
                html: "로그인이 필요합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })
                .then((res) => {
                    window.location.href = "/login";
                });
        }
        await getData();
    }
    const getData = async () => {
        const obj = {
            id: sessionStorage.getItem("id"),
        };
        if (props.url !== "TimeCheck" || props.date === "today") {
            const date = new Date();
            const mon = (date.getMonth() + 1).length < 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
            const day = String(date.getDate()).length < 2 ? "0" + date.getDate() : date.getDate();
            obj.day = date.getFullYear() + "-" + mon + "-" + day;
        } else {
            obj.day = props.date;
        }
        console.log("OBJ: ", obj);
        await axios.post(`/timer/userCheck`, obj)
            .then(async res => {
                if (res.data !== "fail") {
                    const data = res.data;
                    console.log(data);
                    const arr = [];
                    for (var i = -1; i < data[1].subject.length; i++) {
                        arr[i + 1] = 0;
                    }
                    var arr2 = Array.from({length: arr.length}, (v, i) => i);
                    if (data[0] !== "") {
                        init(data[0].total, 0);
                        setCount2(data[0].total);
                        arr[0] = data[0].total;
                        for (var i = 0; i < data[0].subjects.length; i++) {
                            const subIdx = data[1].subject.indexOf(data[0].subjects[i].subName);
                            arr2[subIdx + 1] = null;
                            let time = 0;
                            for (var j = 0; j < data[0].subjects[i].subArr.length; j++) {
                                time += data[0].subjects[i].subArr[j].time;
                            }
                            arr[subIdx + 1] = time;
                            init(time, subIdx + 1);
                        }
                        // 시간별 공부량 차트에 보낼 데이터
                        const subjectsTime = res.data[0].subjects;
                        const newArr = [];
                        const startTime = [];
                        for (var k = 0; k < res.data[0].subjects.length; k++) {
                            for (var h = 0; h < subjectsTime[k].subArr.length; h++) {
                                const obj2 = {};
                                const start = subjectsTime[k].subArr[h].startTime.split(":")[0];
                                const time = subjectsTime[k].subArr[h].time;
                                if (!startTime.includes(start)) {
                                    startTime.push(start);
                                    obj2.hour = start;
                                    obj2.time = time;
                                } else {
                                    for (var g = 0; g < newArr.length; g++) {
                                        if (newArr[g].hour === start) {
                                            newArr[g].time += time;
                                        }
                                    }
                                }
                                if (obj2.hour !== undefined) {
                                    newArr.push(obj2);
                                }
                            }
                        }
                        setsubTimeArr(newArr);
                        setPropsData(props.date);
                    } else {
                        if (props.url === "TimeCheck") {
                            setPropsData("공부X");
                        }
                        setsubTimeArr("");
                        init(0, 0);
                    }
                    for (var i = 1; i < arr2.length; i++) {
                        if (arr2[i] == null) {
                            continue;
                        }
                        init(arr[arr2[i]], arr2[i]);
                    }
                    setCountArr(arr);
                    setSubject(data[1].subject);
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const onClickAddSub = async () => {
        const sub = document.getElementsByName("newSub")[0].value;
        if(sub.trim() === "") {
            return;
        }
        if (subjects.includes(sub)) {
            Alert.fire({
                html: "이미 해당 과목이 존재합니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            document.getElementsByName("newSub")[0].value = "";
            return;
        }
        const obj = {
            id: sessionStorage.getItem("id"),
            sub,
        };
        await axios.post(`/timer/addSub`, obj)
            .then(async res => {
                if (res.data !== "fail") {
                    document.getElementsByName("newSub")[0].value = "";
                    setSubject([...subjects, sub]);
                    init(0, subjects.length + 1);
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const startSub = async (e, inx) => {
        stop();
        stop2();
        setIndex(inx + 1);
        setCount(countArr[inx + 1]); // 추가
        await getData();
        await onClickSetTimer(inx + 1);
    }
    const onClickSetTimer = async (index) => {
        if (startTime === "") {
            return;
        }
        stop2();
        const id = sessionStorage.getItem("id");

        await setDay(id, index);
        reset();
    }
    const setDay = async (id, index) => {
        const obj = {
            userId: id,
            subjects: [],
            total: count2,
        };
        await axios.post(`/timer/${obj.userId}/day`, obj)
            .then(async res => {
                if (res.data !== "fail") {
                    console.log(res.data);
                    await setTime(res.data, index);
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const setTime = async (id, index) => {
        const obj = {
            subName: subjects[index - 1],
            subArr: [],
            startTime,
            endTime: getDate(),
            time: count,
        };
        await axios.post(`/timer/${id}/time`, obj)
            .then(res => {
                if (res.data !== "fail") {
                    setStartTime("");
                    getData();
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error));
    }
    const setStart = () => {
        if (startTime !== "") {
            return;
        }
        const day = getDate();
        setCount(countArr[index]);
        setStartTime(day);
    }
    const getDate = () => {
        const date = new Date();
        const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        return h + ":" + m + ":" + s;
    }
    if (props.url === "TimeCheck") {
        return (<>
            {
                propsData === "공부X"
                    ? <div>공부한 데이터가 없습니다!</div>
                    : <>
                        <Chart time={countArr} sub={subjects} cal={calTime}/>
                        <BarChart sub={subTimeArr}/>
                    </>
            }

        </>);
    } else {
        return (
            <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight: "820px", height:"auto"}}>
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor:"#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>스터디 타이머</div>
                </AppBar>
                {/*<div style={{display:"flex"}}>*/}
                {/*<div style={{display:"inline-block"}}>*/}
                <Container>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Paper elevation={4} sx={{maxWidth: 936, marginTop: '20px', overflow: 'hidden', minHeight: "680px", height:"auto", backgroundColor:"lightsteelblue"}}>
                                <Card style={{margin:"20px", marginTop:"40px"}}>
                                    <CardContent>
                                        <div style={{textAlign: "center", fontSize: "70px", paddingTop: 50}}>
                                            <strong>Total</strong></div>
                                        <div style={{textAlign: "center", fontSize: "62px", paddingBottom:50}}>
                                            <Time type={"div"} hours={currentHours[0]} minutes={currentMinutes[0]}
                                                  seconds={currentSeconds[0]}/>
                                        </div>
                                    </CardContent>
                                </Card>


                                <Card style={{margin:"20px"}}>
                                    <CardContent>
                                            <div>
                                                <div style={{textAlign: "center", paddingTop: "35px", fontWeight:"bold", fontSize:"30px"}}>{subjects[index - 1]}</div>
                                                <div style={{fontSize: "40px"}}>
                                                    <Time type={"div"} hours={currentHours[index]} minutes={currentMinutes[index]}
                                                          seconds={currentSeconds[index]}/>
                                                </div>
                                                <div style={{paddingBottom:"35px", }}>
                                                <Button style={{ borderRadius:100,}} variant="contained" onClick={() => {
                                                    start();
                                                    start2();
                                                    setStart(index);
                                                }}>Start
                                                </Button>
                                                <Button variant="contained" color="success" style={{marginLeft:"4px", marginRight:"4px",  borderRadius:100,}} onClick={() => {
                                                    stop();
                                                    stop2();
                                                    onClickSetTimer(index);
                                                }}>Stop
                                                </Button>
                                                <Button variant="contained" style={{backgroundColor:"darkred",  borderRadius:100,}} onClick={reset}>Reset</Button>
                                                </div>
                                            </div>
                                    </CardContent>
                                </Card>
                            </Paper>

                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={4} sx={{maxWidth: 936, marginTop: '20px', overflow: 'scroll', height:"680px"}}>
                                <AppBar
                                    position="static"
                                    color="default"
                                    style={{backgroundColor:"lightsteelblue"}}
                                    elevation={0}
                                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                                >
                                    <div align={"left"} style={{fontSize:"20px", fontWeight:"bold", margin:"20px"}}>과목 추가</div>
                                </AppBar>
                                <Card>
                                    <Table  aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align={"center"}>
                                                        <div align={"center"} >
                                                            <TextField id="standard-basic" name={"newSub"} label="Subject" variant="standard" style={{width:"70%"}} />
                                                            <Button variant="contained" color="success"  onClick={onClickAddSub} style={{width:"30px", height:"34px", marginLeft:"10px", marginTop:"10px", fontSize:"20px", borderRadius:100,}}>+</Button>
                                                        </div>
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align={"center"}>
                                                    {subjects.map((sub, inx) => {
                                                        return (
                                                            <>
                                                                <div className={sub} onClick={(e) => {
                                                                    startSub(e, inx)
                                                                }}>
                                                                    <div align={"right"}>
                                                                        <span>
                                                                            <Tooltip title="과목명 변경">
                                                                            <FontAwesomeIcon
                                                                            style={{
                                                                                width: "20px",
                                                                                height: "20px",
                                                                                marginRight: "10px",
                                                                            }}
                                                                            icon={faPen} onClick={(e) => {
                                                                            onClickModiSub(sub, inx, false)
                                                                        }}/>
                                                                            </Tooltip>
                                                                        </span>
                                                                        <span>
                                                                            <Tooltip title="삭제">
                                                                                <FontAwesomeIcon
                                                                                style={{
                                                                                    width: "20px",
                                                                                    height: "20px",
                                                                                }}
                                                                                icon={faDeleteLeft} onClick={(e) => {
                                                                                onClickDelSub(sub, inx)
                                                                            }}/>
                                                                            </Tooltip></span>
                                                                    </div>
                                                                    {
                                                                        inx == modifyBoo
                                                                            ?
                                                                            <>
                                                                                <input type={"text"} name="modifySub"
                                                                                       defaultValue={sub}
                                                                                       style={{width: "100px"}}/>
                                                                                <FontAwesomeIcon
                                                                                    style={{
                                                                                        width: "20px",
                                                                                        height: "20px",
                                                                                        marginLeft: "6px"
                                                                                    }}
                                                                                    icon={faPen} onClick={(e) => {
                                                                                    onClickModiSub(sub, inx, true)
                                                                                }}/>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <span style={{ fontWeight:"bold", fontSize:"20px"}}>{sub}</span>
                                                                                <span style={{fontWeight:"bold", fontSize:"20px"}}><Time type={"div"} hours={currentHours[inx + 1]}
                                                                                      minutes={currentMinutes[inx + 1]}
                                                                                      seconds={currentSeconds[inx + 1]}/></span>
                                                                            </>

                                                                    }
                                                                </div>
                                                                <hr/>

                                                            </>
                                                        );

                                                    })
                                                    }
                                                </TableCell>


                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Card>
                            </Paper>

                        </Grid>

















                        {/*<Grid item xs={1}/>*/}
                        {/*<Grid item xs={5}>*/}
                        {/*    <div style={{textAlign: "left", fontSize: "45px", paddingTop: 40}}>*/}
                        {/*        <strong>Total</strong></div>*/}
                        {/*    <div style={{textAlign: "left", fontSize: "40px"}}>*/}
                        {/*        <Time type={"div"} hours={currentHours[0]} minutes={currentMinutes[0]}*/}
                        {/*              seconds={currentSeconds[0]}/>*/}
                        {/*    </div>*/}
                        {/*</Grid>*/}

                        {/*<Grid item xs={6}>*/}
                        {/*    <divv>*/}
                        {/*        <div style={{textAlign: "center", paddingTop: "35px"}}>{subjects[index - 1]}</div>*/}
                        {/*        <div style={{fontSize: "25px"}}>*/}
                        {/*            <Time type={"div"} hours={currentHours[index]} minutes={currentMinutes[index]}*/}
                        {/*                  seconds={currentSeconds[index]}/>*/}
                        {/*        </div>*/}
                        {/*        <Button variant="contained" onClick={() => {*/}
                        {/*            start();*/}
                        {/*            start2();*/}
                        {/*            setStart(index);*/}
                        {/*        }}>Start*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="contained" color="success" style={{marginLeft:"4px", marginRight:"4px"}} onClick={() => {*/}
                        {/*            stop();*/}
                        {/*            stop2();*/}
                        {/*            onClickSetTimer(index);*/}
                        {/*        }}>Stop*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="contained" style={{backgroundColor:"darkred"}} onClick={reset}>Reset</Button>*/}
                        {/*    </div>*/}
                        {/*</Grid>*/}

                        {/*<Grid item xs={12}>*/}
                        {/*    <div align={"right"} style={{paddingRight: "15.5%"}}>*/}
                        {/*        <input type={"text"} name={"newSub"} style={{width: "100px", marginBottom: "30px"}}/>*/}
                        {/*        <Button variant="contained" onClick={onClickAddSub}>추가</Button>*/}
                        {/*    </div>*/}

                        {/*    {*/}
                        {/*        subjects.map((sub, inx) => {*/}
                        {/*            return (*/}
                        {/*                <>*/}
                        {/*                    <div style={{marginRight: "30px", marginBottom: "20px"}}>*/}
                        {/*                        <Button variant="text" className={sub} onClick={(e) => {*/}
                        {/*                            startSub(e, inx)*/}
                        {/*                        }}> >*/}
                        {/*                        </Button>*/}
                        {/*                        {*/}
                        {/*                            inx == modifyBoo*/}
                        {/*                                ? <>*/}
                        {/*                                    <input type={"text"} name="modifySub" defaultValue={sub}*/}
                        {/*                                           style={{width: "100px"}}/>*/}
                        {/*                                    <FontAwesomeIcon*/}
                        {/*                                        style={{width: "20px", height: "20px", marginLeft: "6px"}}*/}
                        {/*                                        icon={faPen} onClick={(e) => {*/}
                        {/*                                        onClickModiSub(sub, inx, true)*/}
                        {/*                                    }}/>*/}
                        {/*                                </>*/}
                        {/*                                : <>*/}
                        {/*                                    <span style={{marginLeft: "6px"}}>{sub}</span>*/}
                        {/*                                    <Time type={"div"} hours={currentHours[inx + 1]}*/}
                        {/*                                          minutes={currentMinutes[inx + 1]}*/}
                        {/*                                          seconds={currentSeconds[inx + 1]}/>*/}
                        {/*                                    <FontAwesomeIcon*/}
                        {/*                                        style={{width: "20px", height: "20px", marginLeft: "6px"}}*/}
                        {/*                                        icon={faPen} onClick={(e) => {*/}
                        {/*                                        onClickModiSub(sub, inx, false)*/}
                        {/*                                    }}/>*/}
                        {/*                                </>*/}
                        {/*                        }*/}
                        {/*                        <FontAwesomeIcon*/}
                        {/*                            style={{width: "20px", height: "20px", marginLeft: "6px"}}*/}
                        {/*                            icon={faDeleteLeft} onClick={(e) => {*/}
                        {/*                            onClickDelSub(sub, inx)*/}
                        {/*                        }}/>*/}
                        {/*                    </div>*/}
                        {/*                </>*/}
                        {/*            );*/}
                        {/*        })*/}
                        {/*    }*/}
                        {/*</Grid>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                    </Grid>
                </Container>
            </Paper>);
    }
}

export default Timer;