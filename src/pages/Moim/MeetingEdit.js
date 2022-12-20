import React, {useState} from 'react';
import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    Avatar, Button, Grid, Paper, TextField, Box, FormControl,
    Select, MenuItem, AppBar, Toolbar
} from "@mui/material";
import {Input, Textarea} from "@mui/joy";
import Alert from "sweetalert2";
import ImgUpload from "../../component/ImgUpload";

export default function MeetingEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const meetName = params.meetName;

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
    const [moim, setMoim] = useState();
    const [fimg, setFimg] = useState();

    const [ucnt, setUCnt] = useState();
    const min = 2;
    const max = 100;

    useState(() => {
        console.log("meetName : ", meetName);
        axios.get(`/Moim/${meetName}/moimDetail`)
            .then((res) => {
                console.log(res.data);
                setMoim(res.data)
                setImg(res.data.img);
                setFimg(res.data.img);
                setCategory(res.data.category);
                console.log(res.data.category)
                if(res.data.category === "공모전"){
                    setContest(true);
                }
                setMeetIntro(res.data.meetIntro);
                setUCnt(res.data.userCnt);
                // return res.data.img;
            })
    }, []);

    function onChange(e) {
        console.log(e.target.files[0]);
        if (e.target.files[0]) {
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

    function onChangeCategory(e) {
        setCategory(e.target.value)
        if (e.target.value === "공모전") {
            setContest(true)
        } else {
            setContest(false)
        }
    }

    function handleInputMeetIntro(e) {
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
    }

    function cntChange(e) {
        const value = Math.max(min, Math.min(max, Number(e.target.value)));
        setUCnt(value);
    }

    function create () {

    }

    async function update() {
        const category = document.getElementById("category");
        const meetIntro = document.getElementsByName("meetIntro")[0];
        const contestName = document.getElementsByName("contestName")[0];
        console.log(contestName)
        if(ucnt < 2){
            Alert.fire({
                html: "인원수는 2명 이상 선택해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if(fimg === imgfile){
            filepath = imgfile;
        }else{
            filepath = filepath + ImgUpload(imgfile, meetName);
        }
        const data = {
            img: filepath,
            userCnt: ucnt,
            category: category.innerHTML,
            meetIntro: meetIntro.value,
        }
        if(contest){
            if(contestName.value === ""){
                Alert.fire({
                    html: "공모전명을 입력해 주세요",
                    icon: "warning",
                    confirmButtonColor: "#1976D2",
                    confirmButtonText: "확인"
                });
                return;
            }
            data.contestName = contestName.value;
        }

        await axios.post(`/Moim/${meetName}/moim/update`, data)
            .then(res => {
                if (res.data !== "fail") {
                    Alert.fire({
                        html: "모임 수정이 완료되었습니다",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    }).then((res)=>{
                        setTimeout(() => {
                            window.location.href = `/meeting/${meetName}`;
                        }, 200);
                    });
                } else {
                    Alert.fire({
                        html: "DB 에러",
                        icon: "error",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "확인"
                    });
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <Paper sx={{maxWidth: 936, minHeight: "822px", margin: 'auto', overflow: 'hidden', height: "auto"}}>
                <AppBar
                    position="static"
                    color="default"
                    style={{backgroundColor: "#dae6f1"}}
                    elevation={0}
                    sx={{borderBottom: '2px solid rgba(0, 0, 0, 0.12)'}}
                >
                    <Toolbar>
                        <div align={"right"} style={{color: "black", fontSize: "24px", fontWeight: "bolder"}}>
                            모임 수정
                        </div>
                    </Toolbar>
                </AppBar>
                <div style={{width: "80%"}}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Avatar
                                src={img}
                                style={{margin: '20px'}}
                                sx={{width: 150, height: 150}}
                                onChange={() => {
                                    setImg(img)
                                }}
                            />

                            <Button component="label">
                                사진 올리기<input accept="image/*" style={{display: "none"}} name={"img"} type="file"
                                             onChange={onChange}/>
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                inputProps={{style: {fontSize: 20}}}
                                InputLabelProps={{style: {fontSize: 20}}}
                                required
                                id="meetName"
                                name="meetName"
                                fullWidth
                                readonly
                                value={meetName}
                                autoComplete="shipping address-line1"
                                variant="standard"
                            />
                        </Grid>
                        {console.log(moim)}
                        {
                            contest === true
                                ? (
                                    moim.contestName !== ""
                                    ? <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="contestName"
                                                name="contestName"
                                                label="공모전명"
                                                fullWidth
                                                placeholder="영문 소문자/한글/숫자, 2~12자"
                                                autoComplete="shipping address-line1"
                                                variant="standard"
                                                value={moim.contestName}
                                            />
                                        </Grid>
                                        : <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="contestName"
                                                name="contestName"
                                                label="공모전명"
                                                fullWidth
                                                placeholder="영문 소문자/한글/숫자, 2~12자"
                                                autoComplete="shipping address-line1"
                                                variant="standard"
                                            />
                                        </Grid>
                                )
                                : null
                        }
                        <Grid item xs={12}>
                            <Box sx={{minWidth: 120}}>
                                {
                                    category === "공모전"
                                        ? <FormControl fullWidth>
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
                                                <MenuItem value={"공모전"}>공모전</MenuItem>
                                            </Select>
                                        </FormControl>
                                        : <FormControl fullWidth>
                                            {/*<InputLabel id="demo-simple-select-label">카테고리</InputLabel>*/}
                                            <Select
                                                id={"category"}
                                                onChange={(e) => {
                                                    onChangeCategory(e)
                                                }}
                                                style={{fontSize: "20px"}}
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
                                <Input
                                    type={"number"}
                                    placeholder={"인원수를 설정해주세요!"}
                                    style={{
                                        marginTop: "30px",
                                        fontSize: "20px",
                                        paddingTop: "16px",
                                        paddingBottom: "16px",
                                        textAlignLast: "center"
                                    }}
                                    id="userCnt"
                                    name={"userCnt"}
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
                                value={meetIntro}
                                name="meetIntro"
                                onChange={handleInputMeetIntro}
                                error={meetError ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={update} style={{marginBottom:"40px"}}>
                                모임 수정
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </>
    );
}