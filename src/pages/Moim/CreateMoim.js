import React, {useState, useEffect} from 'react';
import {Avatar, Button, Grid, TableCell, TextField} from "@mui/material";
import axios from "axios";
import {FormControl, Select, MenuItem, Box, Paper, Toolbar, AppBar} from "@mui/material";
import {useNavigate, useLocation} from "react-router-dom";
import ImgUpload from "../../component/ImgUpload";
import {Input, Textarea} from "@mui/joy";
import Alert from 'sweetalert2';

function CreateMoim() {
    const navigate = useNavigate();
    const location = useLocation();

    //모임명 유효성 및 중복검사
    const [mNickError, setMNickError] = useState("");   //닉네임 오류 메세지
    const [regNickName, setRegNickName] = useState(false);
    const [nickError, setNickError] = useState(false);//닉네임 확인
    const [nickCError, setNickCError] = useState(false);//닉네임 중복확인
    const [checkNickName, setCheckNickName] = useState(false); //닉네임 검사

    //활동 내용 유효성
    const [meetIntro, setMeetIntro] = useState("");
    const [regMeetIntro, seRregMeetIntro] = useState(false);
    const [meetError, setMeetError] = useState(false);//닉네임 확인
    const [mMeetError, setMMeetError] = useState("");   //닉네임 오류 메세지
    const [checkMeetIntro, setCheckMeetIntro] = useState(false); //닉네임 검사

    // 공모전인지 아닌지
    const [contest, setContest] = useState(false);

    //None 처리
    const [category, setCategory] = React.useState("");

    const [img, setImg] = useState("https://frameworklab.imweb.me/common/img/default_profile.png");
    let filepath = "/";
    const [imgfile, setImgFile] = useState({});
    const [imgC, setImgCheck] = useState(false);

    const [ucnt, setUCnt] = useState('');
    const min = 2;
    const max = 100;

    useEffect(() => {
        // 공모전 모임 만들기임
        if(location.state !== null){
            console.log("공모전: ", location.state);
            setContest(true);
        }
    }, [])

    function cntChange(e) {
        const value = Math.max(min, Math.min(max, Number(e.target.value)));
        setUCnt(value);
    }

    const handleInputMeetIntro = (e) => {
        var regExp4 = /^(?=.{30,}$).*/
        setMeetIntro(e.target.value);
        if (e.target.value.trim().length >= 30) {
            seRregMeetIntro(true)
            setMeetError(false);
            setMMeetError('');
            setCheckMeetIntro(true);
        } else {
            seRregMeetIntro(false);
            setMeetError(true);
            setMMeetError('형식에 맞춰 입력해 주세요.');
        }
    };


    const handleInputNickName = (e) => {
        var regExp4 = /^(?=.*[a-z0-9가-힣])[a-zA-Z0-9가-힣-\s]{2,12}$/
        if (regExp4.test(e.target.value)) {
            setRegNickName(true)
            setNickError(false);
            setMNickError('');
            meetNameCheck(e);
        } else {
            setRegNickName(false);
            setNickError(true);
            setMNickError('형식에 맞춰 입력해 주세요.');
        }
    };

    const meetNameCheck = async (e) => {
        e.preventDefault();
        const nick = document.getElementsByName("meetName");
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
        await axios.get('/Moim/checkName', {
            params: {
                meetName: dup
            }
        })
            .then(res => {
                if (res.data === "F") {
                    setCheckNickName(false);
                    setNickCError(true);
                    setMNickError('이미 존재하는 모임 명 입니다.');
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

    const create = async ()=>{
        if(checkNickName && checkMeetIntro){
            const uniName = JSON.parse(sessionStorage.getItem("user")).uniName;
            const meetName = document.getElementById("meetName").value;
            const Intro = meetIntro;
            if(imgC) {
                filepath = filepath + ImgUpload(imgfile, meetName);
            }else {
                filepath = img;
            }
            const obj = {
                leader:sessionStorage.getItem("id"),
                uniName:uniName,
                meetName: meetName,
                meetIntro:Intro,
                img: filepath,
            }
            if(location.state == null){
                const category = document.getElementById("category").innerHTML;
                if(category[0] === "<"){
                    Alert.fire({
                        html: "카테고리를 선택해 주세요",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                    return;
                }
                obj.category = category;
            }
            const userCnt = document.getElementById("userCnt").value;
            console.log(userCnt);
            if(userCnt === "<"){
                Alert.fire({
                    html: "인원수를 선택해 주세요",
                    icon: "warning",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                });
                return;
            }
            obj.userCnt = Number(userCnt);
            if(contest === true){
                const contestName = document.getElementsByName("contestName")[0].value;
                if(contestName === ""){
                    Alert.fire({
                        html: "공모전명을 입력해 주세요",
                        icon: "warning",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                    return;
                }
                if(location.state != null){
                    obj.category = document.getElementById("category").value;
                }
                obj.contestName = contestName;
                console.log(obj);
                await axios.post("/Moim/createContestMoim", obj)
                    .then((res)=>{
                        setTimeout(()=>{window.location.href =`/meeting/${res.data}`}, 200);
                        // window.location.href =`/meeting/${res.data}` //원래는 이게 맞지만 엄청난 속도 버그로인한 setTimeout사용

                    })
            }else{
                await axios.post("/Moim/createMoim", obj)
                    .then((res)=>{
                        setTimeout(()=>{window.location.href =`/meeting/${res.data}`}, 200);
                        // window.location.href =`/meeting/${res.data}` //원래는 이게 맞지만 엄청난 속도 버그로인한 setTimeout사용
                    })
            }
        }else{
            Alert.fire({
                html: "다시 한 번 확인해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
        }

    }

    const onChange = (e) => {
        console.log(e.target.files[0]);
        if(e.target.files[0]){
            setImg(e.target.files[0]);
            setImgFile(e.target.files[0]);
            console.log(img);
            console.log(imgfile);
            setImgCheck(true);
        }else{ //업로드 취소할 시
            setImg(img);
            setImgCheck(false);
            return;
        }
        //화면에 프로필 사진 표시
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                setImg(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }
    const onChangeCategory = (e) => {
        setCategory(e.target.value)
        if(e.target.value === "공모전" ){
            setContest(true)
        }else{setContest(false)}
    }

    const back =()=>{
        window.history.back();
    }
    return (
        <React.Fragment>
            <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto", marginBottom:20 }} >
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor:"#dae6f1"}}
                    elevation={0}
                    sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <Toolbar>
                        <div align={"right"} style={{color:"black", fontSize:"24px",  fontWeight:"bolder"}}>
                            모임 만들기
                        </div>
                    </Toolbar>
                </AppBar>
                <div style={{width:"80%"}}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <div style={{paddingTop:10}}>
                            <Avatar
                                src={img}
                                style={{margin:'20px'}}
                                sx={{ width: 150, height: 150}}
                                onChange={() => {setImg(img)}}
                            />
                            </div>
                            <Button component="label">
                                사진 올리기<input accept="image/*" style={{display:"none"}} name={"img"} type="file" onChange={onChange} />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                inputProps={{style: {fontSize: 20}}}
                                InputLabelProps={{style: {fontSize: 20}}}
                                required
                                id="meetName"
                                name="meetName"
                                label="모임 명"
                                fullWidth
                                placeholder="영문 소문자/한글/숫자, 2~12자"
                                autoComplete="shipping address-line1"
                                variant="standard"
                                onChange={handleInputNickName}
                                error={nickError ? true : nickCError ? true : false}
                                helperText={nickError === true ? mNickError : nickCError === true ? mNickError : ''}
                            />
                        </Grid>
                        {
                            location.state !== null
                            ? <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="contestName"
                                        name="contestName"
                                        label="공모전 명"
                                        fullWidth
                                        placeholder="영문 소문자/한글/숫자, 2~12자"
                                        autoComplete="shipping address-line1"
                                        variant="standard"
                                        value={location.state.obj.titles}
                                    />
                                </Grid>
                                : (
                                    contest === true
                                    ? <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="contestName"
                                                name="contestName"
                                                label="공모전 명"
                                                fullWidth
                                                placeholder="영문 소문자/한글/숫자, 2~12자"
                                                autoComplete="shipping address-line1"
                                                variant="standard"
                                            />
                                        </Grid>
                                        : null
                                )
                        }
                        <Grid item xs={12}>
                            <Box sx={{ minWidth: 120 }}>
                                {
                                    location.state !== null
                                    ? <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="category"
                                                name="category"
                                                label="카테고리"
                                                fullWidth
                                                autoComplete="shipping address-line1"
                                                variant="standard"
                                                value="공모전"
                                            />
                                        </Grid>
                                        : <FormControl fullWidth>
                                            {/*<InputLabel id="demo-simple-select-label">카테고리</InputLabel>*/}
                                            <Select
                                                id={"category"}
                                                onChange={(e) => {onChangeCategory(e)}}
                                                style={{fontSize:"20px"}}
                                                value={category}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled hidden>
                                                    <em>-- 카테고리 -- </em>
                                                </MenuItem>
                                                <MenuItem value={"취미"}>취미</MenuItem>
                                                <MenuItem value={"스터디"}>스터디</MenuItem>
                                                <MenuItem value={"공모전"}>공모전</MenuItem>
                                                <MenuItem value={"사교/인맥"}>사교/인맥</MenuItem>
                                                <MenuItem value={"기타"}>기타</MenuItem>
                                            </Select>
                                        </FormControl>
                                }
                                {/*<FormControl fullWidth style={{marginTop:"20px"}}>*/}
                                {/*    <InputLabel id="demo-simple-select-label">인원 수</InputLabel>*/}
                                {/*    <Select*/}
                                {/*        id="userCnt"*/}
                                {/*        label="UserCnt"*/}
                                {/*    >*/}
                                {/*        <MenuItem value={10}>10명</MenuItem>*/}
                                {/*        <MenuItem value={20}>20명</MenuItem>*/}
                                {/*        <MenuItem value={30}>30명</MenuItem>*/}
                                {/*        <MenuItem value={40}>40명</MenuItem>*/}
                                {/*        <MenuItem value={50}>50명</MenuItem>*/}

                                {/*    </Select>*/}
                                {/*</FormControl>*/}


                                <Input
                                    type={"number"}
                                    placeholder={"인원수를 설정해주세요!"}
                                    style={{marginTop:"30px", fontSize:"20px", paddingTop:"16px", paddingBottom:"16px", textAlignLast:"center"}}
                                    id="userCnt"
                                    label="UserCnt"
                                    value={ucnt}
                                    onChange={cntChange}
                                />


                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Textarea
                                id="meetIntro"
                                color="neutral"
                                disabled={false}
                                minRows={2}
                                placeholder="활동할 모임을 소개해 주세요!(30자 이상)"
                                size="lg"
                                variant="outlined"
                                required
                                minLength={30}
                                onChange={handleInputMeetIntro}
                                error={meetError ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{marginTop:"-20px", marginBottom:"20px"}}>
                            <Button variant={"contained"} id="button123123" onClick={create}>
                                모임 생성
                            </Button>
                                &nbsp;&nbsp;
                            <Button variant={"contained"} style={{backgroundColor:"darkred"}} id="button123123" onClick={back}>
                                뒤로 가기
                            </Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </React.Fragment>
    );
}

export default CreateMoim;