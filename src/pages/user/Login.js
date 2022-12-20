import React from "react";
import axios from 'axios';
import {CssBaseline, TextField, createTheme, ThemeProvider} from '@mui/material';
import { Box, Container, Button, Link, Avatar, Grid, Typography, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from 'sweetalert2';

function Login() {
    sessionStorage.clear();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const loginId = e.target.loginId.value;
        const loginPw = e.target.loginPw.value;
        await axios.post(`/user/login`, {
            id:loginId,
            pw:loginPw
        })
            .then((response) => {
                if (response.data != "") {
                    Alert.fire({
                        html: "로그인에 성공하였습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res)=>{
                        sessionStorage.setItem('id', loginId);
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        window.location.href = "/";
                    })
                }
                else {
                    Alert.fire({
                        html: "아이디 혹은 비밀번호를 확인해 주세요",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res)=>{
                        e.target.loginId.value = "";
                        e.target.loginPw.value = "";
                        e.target.loginId.focus();
                    })
                }
            });
    }

    const theme = createTheme();

    return (
        <React.Fragment>
            <Paper sx={{maxWidth: 630, margin: 'auto', overflow: 'hidden', marginTop:"70px", borderRadius:"30px"}}>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: "20px",
                            marginBottom: "10px",
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
                        <Typography component="h1" variant="h5" marginTop="15px" marginBottom={"10px"}>
                            로그인
                        </Typography>
                        <Box component="form" onSubmit={onSubmitHandler} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="loginId"
                                label="아이디"
                                name="loginId"
                                autoComplete="id"
                                autoFocus
                                inputProps={{maxLength:16}}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="loginPw"
                                label="비밀번호"
                                type="password"
                                id="loginPw"
                                autoComplete="current-password"
                                inputProps={{maxLength:16}}
                            />
                            <Grid container justifyContent="center">
                            <Button
                                type="submit"
                                variant="outlined"
                                fullWidth
                                size="large"
                                sx={{mt: 5, mb: 7}}
                            >
                                로그인
                            </Button>
                            </Grid>

                            <div style={{marginTop:"-40px", marginBottom:"40px"}}>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <div align={"left"}>
                                        <Link href={"/idFind"} variant="body2">
                                            아이디/
                                        </Link>
                                        <Link href={"/pwFind"} variant="body2">
                                            비밀번호 찾기
                                        </Link>
                                        </div>
                                    </Grid>
                                    <Grid item xs={3}>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Link href={"/join"} variant="body2">
                                            {"계정이 없으신가요?"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </div>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            </Paper>
        </React.Fragment>
    );
}

export default Login;
