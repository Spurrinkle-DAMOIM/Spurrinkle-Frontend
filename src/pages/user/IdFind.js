import React, {useState, useEffect, useRef, useCallback} from "react";
import axios from "axios";
import {Box, Button, Container, createTheme, Paper, TextField, ThemeProvider, Typography} from "@mui/material";
import Alert from "sweetalert2";

export default function IdFind() {
    const theme = createTheme();
    const [emailError, setEmailError] = useState(false);
    const [mEmailError, setMEmailError] = useState("");
    const [cEmailError, setCEmailError] = useState(false);
    const [regEmail, setRegEmail] = useState(false);
    const [male, setMale] = useState("A");
    const [name, setName] = useState("");   //본인인증 이름
    const [phone, setPhone] = useState(""); //본인인증 전화번호

    const handleInputEmail = (e) => {
        var regExp3 = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (regExp3.test(e.target.value)) {
            setRegEmail(true);
            setEmailError(false);
            setMEmailError('');
        } else {
            setRegEmail(false);
            setEmailError(true);
            setMEmailError('학교 이메일 형식에 맞춰 입력해 주세요.');
        }
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        const inputEmail = document.getElementById('userEmail');
        const eVal = inputEmail.value;
        if (regEmail === false) {
            Alert.fire({
                html: "이메일을 확인해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.post(`/user/idFind`, {
            email: eVal
        }).then((res) => {
            console.log(res.data);
            if (res.data === "T") {
                Alert.fire({
                    html: "아이디가 이메일로 전송되었습니다",
                    icon: "success",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                }).then((res) => {
                    window.location.href = '/login';
                });
            } else {
                Alert.fire({
                    html: "존재하지 않는 이메일 입니다",
                    icon: "error",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                })
            }
        })
    }

    // 본인인증
    function check(e) {
        var IMP = window.IMP; // 생략 가능
        IMP.init(""); // 예: imp00000000
        IMP.certification(
            //파라미터 생략시 빈 object는 입력해줘야한것 같음. 제거 시 모듈 동작 안함.
            {},
            function (rsp) {
                //본인인증 성공 프로세스
                if (rsp.success) {
                    axios.post('/user/check/info', {
                        imp_uid: rsp.imp_uid
                    }).then(function (res) {
                        Alert.fire({
                            title: "인증에 성공하였습니다",
                            html: "아이디 : "+ res.data,
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        })
                    }).catch(function (e) {
                        console.log(e);
                    })
                }
                //본인인증 실패 프로세스
                else {
                    Alert.fire({
                        title: "인증에 실패하였습니다",
                        html: rsp.error_msg,
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                }
            }
        );
    }

    return (
        <React.Fragment>
            {/*<Paper sx={{maxWidth: 630, margin: 'auto', overflow: 'hidden', marginTop:"70px", borderRadius:"30px"}}>*/}
            <Paper sx={{maxWidth: 630, margin: 'auto', overflow: 'hidden', marginTop: "70px", borderRadius: "30px"}}>
                <ThemeProvider theme={theme}>
                    <Container component="main">
                        <Box
                            sx={{
                                marginTop: "20px",
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                noWrap
                                component="a"
                                href="/"
                                style={{
                                    display: {xs: 'none', md: 'flex'},
                                    fontFamily: 'ImcreSoojin',
                                    letterSpacing: '.3rem',
                                    textDecoration: 'none',
                                    fontSize: "50px",
                                    color: 'steelblue',
                                    margin: "-8px"
                                }}
                            >
                                DAMOIM
                            </Button>
                            <Typography component="h1" variant="h5" marginTop="25px" marginBottom={"10px"}>
                                아이디 찾기
                            </Typography>
                            <Box style={{width: "400px", paddingTop: 20, paddingBottom: 30}}>
                                <div align={"left"}>
                                    <div style={{paddingBottom: 30, paddingTop: "30px"}}>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input type="radio" name="gender" id="radioM" value={"A"} defaultChecked={true} onClick={() => {setMale("A")}}/>
                                        &nbsp;&nbsp;
                                        본인인증
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input type="radio" name="gender" id="radioM"
                                               value={"E"} onClick={() => {setMale("E")}}/>
                                        &nbsp;&nbsp;
                                        이메일
                                    </div>
                                    {male === "A"
                                        ? <Button
                                            variant="outlined"
                                            fullWidth
                                            width={"100px"}
                                            size="large"
                                            sx={{mt: 2, mb: 4}}
                                            onClick={check}
                                        >
                                            본인인증
                                        </Button>
                                        :
                                        <>
                                        <TextField
                                            fullWidth
                                            id="userEmail"
                                            label="이메일"
                                            name="userEmail"
                                            inputProps={{maxLength: 30}}
                                            onChange={handleInputEmail}
                                            error={emailError ? true : cEmailError ? true : false}
                                            helperText={emailError === true ? mEmailError : cEmailError === true ? mEmailError
                                                : emailError === true || cEmailError === true ? "이메일을 확인해 주세요." : ''}
                                        />
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            width={"100px"}
                                            size="large"
                                            sx={{mt: 3, mb: 5}}
                                            onClick={sendEmail}
                                        >
                                            보내기
                                        </Button>
                                        </>
                                    }
                                </div>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </Paper>
        </React.Fragment>
    );
}