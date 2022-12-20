import React, {useState} from 'react';
import axios from 'axios';
import {
    Avatar, Button, Container, CssBaseline, TextField,
    Link, Grid, Box, Typography
} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from 'sweetalert2';

function Join() {
    //오류 확인
    const [idError, setIdError] = useState(false); //아이디 유효성
    const [idCError, setIdCError] = useState(false);//아이디 중복확인
    const [pwError, setPwError] = useState(false);  //비밀번호 유효성
    const [cpwError, setCpwError] = useState(false);//비밀번호 확인
    const [emailError, setEmailError] = useState(false);//이메일
    const [cEmailError, setCEmailError] = useState(false);//이메일 학교 인증 확인
    const [emailNumError, setEmailNumError] = useState(false);//이메일 인증 번호 확인
    const [nickError, setNickError] = useState(false);//닉네임 확인
    const [nickCError, setNickCError] = useState(false);//닉네임 중복확인

    //오류 메세지
    const [mIdError, setMIdError] = useState("");   //아이디 오류 메세지
    const [mPwError, setMPwError] = useState("");   //비번 오류 메세지
    const [mCpwError, setMCpwError] = useState(""); //비번확인 오류 메세지
    const [mEmailError, setMEmailError] = useState(""); //이메일 오류 메세지
    const [mEmailNumError, setMEmailNumError] = useState(false);//이메일 인증 번호 오류 메세지
    const [mNickError, setMNickError] = useState("");   //닉네임 오류 메세지

    //인증 데이터 저장
    const [name, setName] = useState("");   //본인인증 이름
    const [phone, setPhone] = useState(""); //본인인증 전화번호
    const [uni, setUni] = useState("");     //이멜검사 대학명
    const [emailNum, setEmailNum] = useState("");   //이맬검사 인증번호

    //유효성 검사
    const [regId, setRegId] = useState(false);      //아이디
    const [regPw, setRegPw] = useState(false);      //비밀번호
    const [regEmail, setRegEmail] = useState(false);
    const [regNickName, setRegNickName] = useState(false);  //닉네임

    //검사 확인 유/무
    const [checkId, setCheckId] = useState(false); //아이디 중복검사
    const [checkEmail, setCheckEmail] = useState(false); //이메일 검사
    const [checkEmailNum, setCheckEmailNum] = useState(false); //이메일 인증번호 검사
    const [checkNickName, setCheckNickName] = useState(false); //닉네임 검사

    const [isShown, setIsShown] = useState(true); //

    const handleInputId = (e) => {
        var regExp1 = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-z]{4,16}$/;
        if (regExp1.test(e.target.value)) {
            setRegId(true);
            idDupCheck(e);
            setIdError(false);
            setMIdError('')
        } else {
            setRegId(false);
            setIdError(true);
            setMIdError('아이디 형식에 맞춰 입력해 주세요.');
        }
    };
    const handleInputPw = (e) => {
        var regExp2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*?.])[a-zA-Z\d!~!@#$%^&*?.]{8,16}$/
        if (regExp2.test(e.target.value)) {
            setRegPw(true);
            setPwError(false);
            setMPwError('');
        } else {
            setRegPw(false);
            setPwError(true);
            setMPwError('비밀번호 형식에 맞춰 입력해 주세요. ( 특수문자 : ~, !, @, #, $, %, ^, &, *, .)');
        }
    };
    const handleInputCpw = () => {
        const pw = document.getElementById('joinPw').value;
        const cpw = document.getElementById('joinCpw').value;
        if (pw !== cpw) {
            setCpwError(true);
            setMCpwError('비밀번호가 일치하지 않습니다.');
        } else {
            setCpwError(false);
            setMCpwError('');
        }
    }
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
    const handleInputNickName = (e) => {
        var regExp4 = /^(?=.*[a-z0-9가-힣])[a-zA-Z0-9가-힣]{2,12}$/
        if (regExp4.test(e.target.value)) {
            setRegNickName(true)
            setNickError(false);
            setMNickError('');
            nickDupCheck(e);
        } else {
            setRegNickName(false);
            setNickError(true);
            setMNickError('닉네임 형식에 맞춰 입력해 주세요.');
        }
    };

    const onFinish = (e) => {
        e.preventDefault(); // 기본동작 막기
        const pw = e.target.joinPw.value;
        const cpw = e.target.joinCpw.value;

        if (regId === false) {
            setCheckId(false);
            Alert.fire({
               html: "아이디를 확인해 주세요",
               icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (regPw === false) {
            Alert.fire({
                html: "비밀번호를 확인해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (pw !== cpw) {
            Alert.fire({
                html: "비밀번호가 일치하지 않습니다",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (name === "" || phone === "") {
            Alert.fire({
                html: "본인인증을 완료해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if(regEmail === false)
        {
            Alert.fire({
                html: "이메일을 확인해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if(checkEmailNum === false) {
            Alert.fire({
                html: "이메일 인증을 완료해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (regNickName === false) {
            setCheckNickName(false);
            Alert.fire({
                html: "닉네임을 확인해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        onSubmitHandler(e)
    };

    //DB에 삽입
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const joinId = e.target.joinId.value;
        const joinPw = e.target.joinPw.value;
        const joinName = e.target.joinName.value;
        const joinPhone = e.target.joinPhone.value;
        const joinGender = e.target.joinGender.value;
        const joinEmail = e.target.joinEmail.value;
        const joinUni = e.target.joinUni.value;
        const joinNickName = e.target.joinNickName.value;
        console.log(joinId, joinPw, joinName, joinPhone, joinGender, joinEmail, joinUni, joinNickName);
        await axios.post(`/user/join`, {
            id: joinId,
            pw: joinPw,
            name: joinName,
            tel: joinPhone,
            gender: joinGender,
            email: joinEmail,
            uniName: joinUni,
            nickname: joinNickName
        })
            .then((res) => {
                if (res.data === "T") {
                    Alert.fire({
                        html: "회원가입에 성공하였습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res)=>{
                        window.location.href = '/login';
                    });
                } else {
                    Alert.fire({
                        html: "회원가입에 실패하였습니다",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                }
            })
    };

    // 아이디 중복 검사
    const idDupCheck = async (e) => {
        e.preventDefault();
        const id = document.getElementsByName("joinId");
        const dup = id[0].value;
        await axios.get('/user/idDupCheck', {
            params: {
                id: dup
            }
        })
            .then(res => {
                if (res.data === "F") {
                    setCheckId(false);
                    setIdCError(true);
                    setMIdError('이미 존재하는 아이디 입니다.');
                } else {
                    setCheckId(true);
                    setIdCError(false);
                    setMIdError('');
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    };

    //이메일 인증
    const emailCheck = async (e) => {
        e.preventDefault();
        const email = document.getElementsByName("joinEmail");
        const chk = email[0].value;
        if (chk === "") {
            Alert.fire({
                html: "이메일을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            setCEmailError(true);
            return;
        }
        await axios.get(`/user/emailCheck`,
            {
                params: {
                    email: chk
                }
            })
            .then(res => {
                console.log(res.data);
                if (res.data.status === "F") {
                    setCheckEmail(false);
                    setCEmailError(true);
                    setMEmailError('이미 존재하는 이메일 입니다.');
                }
                else if(res.data.status === "UF"){
                    setCheckEmail(false);
                    setCEmailError(true);
                    setMEmailError('대학교 이메일 형식에 맞춰 작성해 주세요.');
                }
                else {
                    setIsShown(current => {
                        current = true
                    });
                    setCheckEmail(true);
                    setCEmailError(false);
                    setMEmailError('');

                    const inputText = document.getElementById('joinChkEmail');
                    inputText.style.display = '';
                    const inputBtn = document.getElementById('emailNumBtn');
                    inputBtn.style.display = '';

                    setUni(res.data.university);    //해당 이메일의 학교
                    const eNum = res.data.authNum; // 이메일 인증번호
                    setEmailNum(eNum);
                    console.log(eNum);
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    //이메일 인증번호 확인
    const emailNumChk = async (e) => {
        e.preventDefault();
        const email = document.getElementById("joinChkEmail");
        const emailChkNum = email.value;
        console.log(emailNum);
        if (emailChkNum !== emailNum || emailChkNum === "") {
            setCheckEmailNum(false);
            setEmailNumError(true);
            setMEmailNumError('인증번호를 확인해 주세요.');
        } else {
            Alert.fire({
                html: "인증되었습니다",
                icon: "success",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            setEmailNumError(false);
            setMEmailNumError('');
            const inputText = document.getElementById('joinChkEmail');
            setIsShown(current => !current);
            const inputBtn = document.getElementById('emailNumBtn');
            inputBtn.style.display = 'none';
            setCheckEmailNum(true);
        }
    }

    // 닉네임 중복 검사
    const nickDupCheck = async (e) => {
        e.preventDefault();
        const nick = document.getElementsByName("joinNickName");
        const dup = nick[0].value;
        if (dup === "") {
            Alert.fire({
                html: "닉네임을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        await axios.get('/user/nickDupCheck/', {
            params: {
                nickname: dup
            }
        })
            .then(res => {
                if (res.data === "F") {
                    setCheckNickName(false);
                    setNickCError(true);
                    setMNickError('이미 존재하는 닉네임 입니다.');
                } else {
                    setCheckNickName(true);
                    setNickCError(false);
                    setMNickError('');
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    };

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
                    axios.post('/check/info', {
                        imp_uid: rsp.imp_uid
                    }).then(function (res) {
                        setName(res.data.name);
                        setPhone(res.data.phone);
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
        <>
            <CssBaseline/>
            <Container fixed>
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="sm">
                        <CssBaseline/>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5" marginTop="15px">
                                회원가입
                            </Typography>
                            <Box component="form" noValidate onSubmit={onFinish} sx={{mt: 3}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="joinId"
                                            name="joinId"
                                            autoFocus
                                            label="아이디"
                                            placeholder="영문 소문자/숫자, 4~16자"
                                            inputProps={{maxLength: 16}}
                                            onChange={handleInputId}
                                            error={idError ? true : idCError ? true : false}
                                            helperText={idError === true ? mIdError : idCError === true ? '이미 존재하는 아이디 입니다.' :
                                                idError === true && idCError === true ? '아이디를 확인해 주세요' : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="joinPw"
                                            name="joinPw"
                                            label="비밀번호"
                                            type="password"
                                            placeholder="영문 대/소문자/숫자/특수문자 각 1개 이상, 8자~16자"
                                            inputProps={{maxLength: 16}}
                                            onChange={handleInputPw}
                                            error={pwError === true}
                                            helperText={pwError === true ? mPwError : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="joinCpw"
                                            name="joinCpw"
                                            label="비밀번호 확인"
                                            type="password"
                                            inputProps={{maxLength: 16}}
                                            onChange={handleInputCpw}
                                            error={cpwError === true}
                                            helperText={cpwError === true ? mCpwError : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={10} style={{marginTop: 20}}>
                                        <TextField
                                            fullWidth
                                            id="joinName"
                                            name="joinName"
                                            label="이름"
                                            value={name}
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Button style={{marginLeft: 10, marginTop: 35}}
                                            onClick={check}>본인인증</Button>
                                    <Grid item xs={10}>
                                        <TextField
                                            fullWidth
                                            id="joinPhone"
                                            name="joinPhone"
                                            label="전화번호"
                                            value={phone}
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div style={{
                                            marginTop: 5,
                                            marginBottom: 10
                                        }}>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td style={{paddingRight:150}}>
                                                        성별
                                                    </td>
                                                    <td style={{paddingRight:100}}>
                                                        남성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="joinGender" id="radioM" value={"M"}
                                                                 defaultChecked={true} />
                                                    </td>
                                                    <td style={{paddingRight:100}}>
                                                        여성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="joinGender" id="radioF" value={"F"}/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField
                                            fullWidth
                                            id="joinEmail"
                                            name="joinEmail"
                                            label="이메일"
                                            name="joinEmail"
                                            inputProps={{maxLength: 30}}
                                            onChange={handleInputEmail}
                                            error={emailError ? true : cEmailError ? true : false}
                                            helperText={emailError === true ? mEmailError : cEmailError === true ? mEmailError
                                                : emailError === true || cEmailError === true ? "이메일을 확인해 주세요." : ''}
                                        />
                                    </Grid>
                                    <Button style={{marginLeft: 10, marginTop: 17}}
                                            onClick={emailCheck}>인증받기</Button>
                                    <Grid item xs={10}>
                                        <TextField
                                            fullWidth
                                            id="joinChkEmail"
                                            label="인증번호"
                                            inputProps={{maxLength: 8}}
                                            style={{display: isShown ? 'none' : ''}}
                                            error={emailNumError === true}
                                            helperText={emailNumError === true ? mEmailNumError : ''}
                                        />
                                    </Grid>
                                    <Button id={"emailNumBtn"} style={{display: "none", marginLeft: 10, marginTop: 17}}
                                            onClick={emailNumChk}>확인</Button>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="joinUni"
                                            name="joinUni"
                                            label="대학교"
                                            value={uni}
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="joinNickName"
                                            label="닉네임"
                                            name="joinNickName"
                                            placeholder="영문 소문자/한글/숫자, 2~12자"
                                            inputProps={{maxLength: 12}}
                                            onChange={handleInputNickName}
                                            error={nickError ? true : nickCError ? true : false}
                                            helperText={nickError === true ? mNickError : nickCError === true ? mNickError : ''}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center">
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        sx={{mt: 5, mb: 2}}
                                        size="large"
                                    >
                                        회원가입
                                    </Button>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            계정이 있으신가요?
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </Container>
        </>
    );
}

export default Join;

const theme = createTheme();
