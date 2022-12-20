import React, {useState} from 'react';
import axios from 'axios';
import {CssBaseline, TextField, createTheme, ThemeProvider} from '@mui/material';
import {Box, Container, Button, Link, Grid, Typography, Paper} from '@mui/material';
import Alert from "sweetalert2";

export default function PwFind() {
    const theme = createTheme();
    const [emailError, setEmailError] = useState(false);
    const [mEmailError, setMEmailError] = useState("");
    const [cEmailError, setCEmailError] = useState(false);
    const [regEmail, setRegEmail] = useState(false);

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
        if(regEmail === false) {
            Alert.fire({
                html: "이메일을 확인해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.post(`/user/pwFind`, {
            email: eVal
        }).then((res) => {
            console.log(res.data);
            if (res.data === "T") {
                Alert.fire({
                    html: "임시 비밀번호가 이메일로 전송되었습니다",
                    icon: "success",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                }).then((res)=>{
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

    return(
        <React.Fragment>
            {/*<Paper sx={{maxWidth: 630, margin: 'auto', overflow: 'hidden', marginTop:"70px", borderRadius:"30px"}}>*/}
                <Paper sx={{maxWidth: 630, margin: 'auto', overflow: 'hidden', marginTop:"70px", borderRadius:"30px"}}>
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
                                    margin:"-8px"
                                }}
                            >
                                DAMOIM
                            </Button>
                            <Typography component="h1" variant="h5" marginTop="25px" marginBottom={"10px"}>
                                비밀번호 찾기
                            </Typography>
                            <Box style={{width:"400px"}} >
                                <div align={"left"} style={{paddingTop:"30px"}}> · 비밀번호를 찾을 이메일</div>
                                <div width={"230px"} style={{paddingTop:15}}>
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
                                </div>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        width={"100px"}
                                        size="large"
                                        sx={{mt: 5, mb: 7}}
                                        onClick={sendEmail}
                                    >
                                        다음
                                    </Button>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </Paper>
        </React.Fragment>
    );
}