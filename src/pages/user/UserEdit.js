import React, {useState, useEffect, useRef, useCallback} from "react";
import axios from "axios";
import {
    Avatar, Table, TableBody, TableCell, TableContainer, Paper, Container,
    TableHead, Button, Link, TextField, InputBase, Grid
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Alert from "sweetalert2";
import imgUpload from "../../component/ImgUpload";
import AWS from "aws-sdk";
import S3 from 'react-aws-s3';
import {v1, v3, v4, v5} from 'uuid';
import AppBar from "@mui/material/AppBar";

let fNick = '';
export default function UserEdit(props) {
    //오류 확인
    const [pwError, setPwError] = useState(false);  //비밀번호 유효성
    const [cpwError, setCpwError] = useState(false);//비밀번호 확인
    const [nickError, setNickError] = useState(false);//닉네임 확인
    const [nickCError, setNickCError] = useState(false);//닉네임 중복확인

    //오류 메세지
    const [mPwError, setMPwError] = useState("");   //비번 오류 메세지
    const [mCpwError, setMCpwError] = useState(""); //비번확인 오류 메세지
    const [mNickError, setMNickError] = useState("");   //닉네임 오류 메세지

    //검사
    const [regPw, setRegPw] = useState(false);      //비밀번호
    const [regCpw, setRegCpw] = useState(false);      //비밀번호 확인
    const [regNickName, setRegNickName] = useState(false);  //닉네임
    const [checkNickName, setCheckNickName] = useState(false);
    const [auth, setAuth] = useState(false);

    //바뀌는 값
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [gender, setGender] = useState('');
    const [img, setImg] = useState(JSON.parse(sessionStorage.getItem('user')).img);
    const [imgfile, setImgFile] = useState({});
    const [imgC, setImgCheck] = useState(false);

    const fileInput = useRef(null);
    const [email, setEmail] = useState('');
    const [uni, setUni] = useState('');
    const [nick, setNick] = useState('');

    const [isShown, setIsShown] = useState(false);
    const [isShown2, setIsShown2] = useState(false);
    const [isShown3, setIsShown3] = useState(false);
    const [isShown4, setIsShown4] = useState(false);


    useEffect(() => {
        axios.post('/user/profile', {
            id: sessionStorage.getItem('id'),
        })
            .then((res) => {
                const user = res.data;
                setId(user.id);
                setName(user.name);
                setTel(user.tel);
                setGender(user.gender);
                // setImg(user.img);
                setEmail(user.email);
                setUni(user.uniName);
                setNick(user.nickname);
                fNick = user.nickname;
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleInputPw = (e) => {
        const regExp1 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*.?])[A-Za-z\d@$!%*#?&]{8,16}$/;
        if (regExp1.test(e.target.value)) {
            setPw(e.target.value);
            setRegPw(true);
            setPwError(false);
            setMPwError('');
        } else {
            setRegPw(false);
            setPwError(true);
            setMPwError('비밀번호 형식에 맞춰 입력해 주세요. ( 특수문자 : ~, !, @, #, $, %, ^, &, *, ., ? )');
        }
    };
    const handleInputCpw = () => {
        const pw = document.getElementById('pw').value;
        const cpw = document.getElementById('cpw').value;
        if (pw !== cpw) {
            setCpwError(true);
            setMCpwError('비밀번호가 일치하지 않습니다.');
            setRegCpw(false);
        } else {
            setCpwError(false);
            setMCpwError('');
            setRegCpw(true);
        }
    };
    const handleInputNickName = (e) => {
        const nick = document.getElementsByName("nick");
        const dup = nick[0].value;
        setNick(dup);
        const regExp2 = /^(?=.*[a-z0-9가-힣])[a-zA-Z0-9가-힣]{2,12}$/
        if (regExp2.test(e.target.value) || dup === fNick) {
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

    // 닉네임 중복 검사
    const nickDupCheck = async (e) => {
        e.preventDefault();
        const nick = document.getElementsByName("nick");
        const dup = nick[0].value;
        if (dup === "") {
            Alert.fire({
                html: "닉네임을 입력하세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })
            return;
        }
        await axios.get('/user/nickDupCheck', {
            params: {nickname: dup}
        })
            .then(res => {
                if (res.data === "T" || dup === fNick) {
                    setCheckNickName(true);
                    setNickCError(false);
                    setMNickError('');
                } else {
                    setCheckNickName(false);
                    setNickCError(true);
                    setMNickError('이미 존재하는 닉네임 입니다.');
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    };

    //회원 탈퇴
    const userDelete = async (e) => {
        e.preventDefault();
        Alert.fire({
            title: '회원 탈퇴',
            html: "정말 탈퇴하시겠습니까?<br>탈퇴 후엔 계정을 복구할 수 없습니다",
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            showCancelButton: true,
            confirmButtonText: '네',
            cancelButtonText: "닫기",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("id : ", id);
                axios.post('/user/delete', {id: id})
                    .then((res) => {
                        sessionStorage.clear();
                        Alert.fire({
                            title: "탈퇴 처리가 완료되었습니다",
                            html: "그동안 이용해 주셔서 감사합니다",
                            icon: "success",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인",
                        }).then(() => {
                            window.location.href = "/login";
                        })
                    })
            }
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
                    console.log(rsp)
                    console.log(rsp.imp_uid)
                    axios.post('/check/info', {
                        imp_uid: rsp.imp_uid
                    }).then(function (res) {
                        setName(res.data.name);
                        setTel(res.data.phone);
                        setIsShown3(true);
                        setIsShown4(true);
                        setAuth(true);
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

    //비번 변경
    const pwCheck = async (e) => {
        if (regPw === true && regCpw === true) {
            await axios.post('/user/update/pw', {
                id: id,
                pw: pw
            }).then((res) => {
                sessionStorage.setItem('user', JSON.stringify(res.data));
                props.forceUpdate();
                Alert.fire({
                    html: "정상적으로 변경되었습니다",
                    icon: "success",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                })
                setIsShown2(false);
                setIsShown(false);
                const inputPw = document.getElementById("pw");
                inputPw.value = null;
                const inputCpw = document.getElementById("cpw");
                inputCpw.value = null;
            })
        } else {
            Alert.fire({
                html: "변경에 실패하였습니다",
                icon: "error",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })

        }
    };

    //본인인증(이름, 전번) 변경
    const ntCheck = async () => {
        setIsShown4(false);
        setIsShown3(false);
        await axios.post('/user/update/name', {
            id: id,
            name: name,
            tel: tel
        })
            .then((res) => {
                if (auth === true) {
                    setIsShown4(true);
                    setIsShown3(true);
                    setName(res.data.name);
                    setTel(res.data.tel);
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    props.forceUpdate();
                    Alert.fire({
                        html: "정상적으로 변경되었습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                } else {
                    Alert.fire({
                        html: "변경에 실패하였습니다",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                }
            });
    };

    //성별 변경
    // const genderCheck = async (e) => {
    //     console.log("성별 : ",);
    //     await axios.post(`/user/update/gender`, {
    //         id: id,
    //         gender: gender
    //     })
    //         .then((res) => {
    //             sessionStorage.setItem('user', JSON.stringify(res.data));
    //             props.forceUpdate();
    //             Alert.fire(
    //                 '',
    //                 '정상적으로 변경되었습니다',
    //                 'success'
    //             );
    //         })
    //         .catch((err) => {
    //             Alert.fire(
    //                 '',
    //                 '변경에 실패하였습니다',
    //                 'error'
    //             );
    //         })
    // };

    //닉넴 변경
    const nickCheck = async (e) => {
        if (regNickName === true && checkNickName === true) {
            await axios.post(`/user/update/nickname`, {
                id: id,
                nickname: nick
            })
                .then((res) => {
                    setNick(res.data.nickname);
                    sessionStorage.setItem('user', JSON.stringify(res.data));
                    props.forceUpdate();
                    Alert.fire({
                        html: "정상적으로 변경되었습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    })
                })
        } else {
            Alert.fire({
                html: "변경에 실패하였습니다",
                icon: "error",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            })
        }
    }


    //이미지 선택
    const onChange = (e) => {
        console.log(e.target.files[0]);
        if (e.target.files[0]) {
            console.log("맞음");
            setImg(e.target.files[0]);
            setImgFile(e.target.files[0]);
            console.log(img);
            console.log(imgfile);
            setImgCheck(true);
        } else { //업로드 취소할 시
            setImg(img);
            setImgCheck(false);
            return;
        }
        //화면에 프로필 사진 표시
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImg(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }


    //이미지 변경
    const imgCheck = async (e) => {
        // const formData = new FormData();
        // const img = document.getElementsByName('img')[0].value;
        // formData.append("img", img.files[0]);

        // const id = sessionStorage.getItem('id');
        if (imgC) {
            const reFileName = imgUpload(imgfile, id);
            console.log("리턴 받은 파일 이름:", reFileName);

            await axios.post(`/user/update/img`, {
                img: reFileName,
                id: sessionStorage.getItem('id'),
            })
                .then((res) => {
                    if (res.data !== "fail") {
                        console.log("성공", res.data);
                        sessionStorage.setItem('user', JSON.stringify(res.data));
                        setTimeout(() => {
                            window.location.reload()
                        }, 200);
                        // window.location.reload(); //원래는 이게 맞지만 엄청난 속도 버그로인한 setTimeout사용
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
    }

    return (
        <>
            <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', height: "auto"}}>
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor:"#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)', fontWeight:"bold",}}
                ><div align={"left"} style={{margin:"14px", marginLeft:"40px", fontSize:"34px"}}>개인정보</div></AppBar>
                <Container>
                    <Grid container spacing={1}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={10}>
                            <TableContainer>
                                <Table sx={{minWidth: 700}} aria-label={"simple table"}>

                                    <TableHead>
                                        <TableCell style={{paddingTop: "30px"}} colSpan={3}><h5><strong>개인정보 변경</strong>
                                        </h5></TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell sx={{
                                            width: {md: 130}
                                        }}>아이디</TableCell>
                                        <TableCell colSpan={2}>
                                            <TextField
                                                id={"id"}
                                                name={"id"}
                                                value={id}
                                                style={{width: "400px"}}
                                                variant="standard"
                                                inputProps={{readOnly: true}}
                                            /></TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell>비밀번호</TableCell>
                                        <TableCell
                                            colSpan={2}
                                            style={{display: isShown2 ? 'none' : ''}}>
                                            <Button
                                                id='pwBtn'
                                                variant="contained"
                                                onClick={() => {
                                                    setIsShown2(true);
                                                    setIsShown(true);
                                                }}
                                            >변경</Button></TableCell>
                                        <TableCell style={{display: isShown ? '' : 'none'}}>
                                            <TextField
                                                fullWidth
                                                id={"pw"}
                                                name={"pw"}
                                                variant="standard"
                                                type="password"
                                                style={{width: "400px"}}
                                                placeholder="영문 대/소문자/숫자/특수문자 각 1개 이상, 8자~16자"
                                                inputProps={{maxLength: 16}}
                                                onChange={handleInputPw}
                                                error={pwError === true}
                                                helperText={pwError === true ? mPwError : ''}
                                            /></TableCell>
                                        <TableCell
                                            sx={{
                                                width: {md: 100}
                                            }}
                                            style={{display: isShown ? '' : 'none'}}>
                                            <Button
                                                variant="contained"
                                                onClick={pwCheck}
                                            >변경</Button></TableCell>
                                    </TableHead>

                                    <TableHead style={{display: isShown ? '' : 'none'}}>
                                        <TableCell>비밀번호 확인</TableCell>
                                        <TableCell colSpan={2}>
                                            <TextField
                                                fullWidth
                                                id={"cpw"}
                                                name={"cpw"}
                                                variant="standard"
                                                type="password"
                                                style={{width: "400px"}}
                                                inputProps={{maxLength: 16}}
                                                onChange={handleInputCpw}
                                                error={cpwError === true}
                                                helperText={cpwError === true ? mCpwError : ''}
                                            /></TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell>이름</TableCell>
                                        <TableCell>
                                            <TextField
                                                id={"name"}
                                                name={"name"}
                                                value={name}
                                                style={{width: "400px"}}
                                                variant="standard"
                                                inputProps={{readOnly: true}}
                                            /></TableCell>
                                        <TableCell style={{display: isShown3 ? 'none' : ''}}><Button
                                            onClick={check}>본인인증</Button></TableCell>
                                        <TableCell style={{display: isShown4 ? '' : 'none'}}><Button onClick={ntCheck}
                                                                                                     variant="contained">변경</Button></TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell>전화번호</TableCell>
                                        <TableCell colSpan={2}>
                                            <TextField
                                                fullWidth
                                                id={"tel"}
                                                name={"tel"}
                                                variant="standard"
                                                value={tel}
                                                style={{width: "400px"}}
                                                inputProps={{readOnly: true}}
                                            /></TableCell>
                                    </TableHead>

                                    {/*<TableHead>*/}
                                    {/*    <TableCell>성별</TableCell>*/}
                                    {/*    <TableCell>*/}
                                    {/*        <div onClick={(e) => {*/}
                                    {/*            if (e.target.value === 'M' || e.target.value === 'F') {*/}
                                    {/*                setGender(e.target.value);*/}
                                    {/*            }*/}
                                    {/*        }}>*/}
                                    {/*            남성&nbsp;&nbsp;<input type="radio" name="gender" id="radioM" value={"M"}*/}
                                    {/*                                 defaultChecked={true}/>*/}
                                    {/*            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
                                    {/*            여성&nbsp;&nbsp;<input type="radio" name="gender" id="radioF" value={"F"}/></div>*/}
                                    {/*    </TableCell>*/}
                                    {/*    <TableCell align={"center"}><Button variant="contained"*/}
                                    {/*                                        onClick={genderCheck}>변경</Button></TableCell>*/}
                                    {/*</TableHead>*/}

                                    <TableHead>
                                        <TableCell>이메일</TableCell>
                                        <TableCell colSpan={2}>
                                            <TextField
                                                fullWidth
                                                id={"email"}
                                                name={"email"}
                                                variant="standard"
                                                value={email}
                                                style={{width: "400px"}}
                                                inputProps={{readOnly: true}}
                                            /></TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell>대학교</TableCell>
                                        <TableCell colSpan={2}>
                                            <TextField
                                                fullWidth
                                                id={"uni"}
                                                name={"uni"}
                                                variant="standard"
                                                value={uni}
                                                style={{width: "400px"}}
                                                inputProps={{readOnly: true}}
                                            /></TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell>사진</TableCell>
                                        <TableCell colSpan={2}>
                                            <Avatar
                                                src={img}
                                                style={{margin: '20px'}}
                                                sx={{width: 150, height: 150}}
                                                onChange={() => {
                                                    setImg(img)
                                                }}
                                                // onClick={()=>{fileInput.current.click()}}
                                            />

                                            <Button component="label">
                                                사진 올리기<input accept="image/*" style={{display: "none"}} name={"img"}
                                                             type="file" onChange={onChange}/>
                                            </Button>
                                            <br/>
                                            <div style={{paddingTop: 25}}>
                                                <Button variant="contained" onClick={imgCheck}>변경</Button></div>
                                        </TableCell>
                                    </TableHead>

                                    <TableHead>
                                        <TableCell>닉네임</TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                id={"nick"}
                                                name={"nick"}
                                                variant="standard"
                                                value={nick}
                                                style={{width: "400px"}}
                                                placeholder="영문 소문자/한글/숫자, 2~12자"
                                                inputProps={{maxLength: 12}}
                                                onChange={handleInputNickName}
                                                error={nickError ? true : nickCError ? true : false}
                                                helperText={nickError === true ? mNickError : nickCError === true ? mNickError : ''}
                                            /></TableCell>
                                        <TableCell><Button variant="contained"
                                                           onClick={nickCheck}>변경</Button></TableCell>
                                    </TableHead>
                                </Table>
                            </TableContainer>

                            <div align={"left"} style={{paddingTop: 30}}>
                                <Button style={{marginBottom: "30px", backgroundColor: "darkred", color: "white"}}
                                        variant="body2" onClick={userDelete}>
                                    회원 탈퇴
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </Container>
            </Paper>
        </>
    );
};

const theme = createTheme();