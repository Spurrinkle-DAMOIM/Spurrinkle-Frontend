import axios from 'axios';
import Form from 'react-bootstrap/Form';
import {useCallback, useEffect, useState} from "react";
import {useLocation, useParams } from "react-router-dom";
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from "@mui/material/IconButton";
import imgUpload from "../../component/ImgUpload";
import Alert from 'sweetalert2';
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";

function BoardWrite(props) {
    const params = useParams();
    const [datas, setData] = useState([]);
    const [imgIds, setImgIds] = useState([]);
    const [delImgs, setDelImgs] = useState([]);
    const [state, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}),[]);
    let [img2, setImg2] = useState(false);
    const [imgList, setImgList] = useState([]); //이미지 리스트

    const onClickAction = async (e, url, id) =>{
        console.log("id : ", id);
        const title = document.getElementsByName('title')[0].value;
        const author = sessionStorage.getItem("id");
        const content = document.getElementsByName('content')[0].value;

        if(datas[0] !== undefined) {
            for (let i = 0; i < datas[0].img.length; i++) {
                imgList.push(datas[0].img[i]);
                console.log("초기값", imgList);
            }
        }

        const board = {
            title,
            author,
            content,
            likes: 0,
            likesUser: [],
            img: [],
        }
        if(title === ""){
            Alert.fire({
                html: "제목을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        if (content === "") {
            Alert.fire({
                html: "내용을 입력해 주세요",
                icon: "warning",
                confirmButtonColor: "#1976D2",
                confirmButtonText: "확인"
            });
            return;
        }
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const formData = new FormData();
        const img = document.getElementsByName('img')[0];
        console.log('1: '+img.files[0]);


        let filepath = "/";
        for(var i = 0; i < img.files.length; i++){
            console.log('1: '+img.files[i]);
            if(img.files[i] !== undefined){
                imgList.push(filepath + imgUpload(img.files[i], sessionStorage.getItem("id")));
            }

            // setImgList([...imgList, imgList]);  //버튼이 눌렸을때 새로운 사진 바로바로 업로드
            console.log('추가될 이미지 : '+img.files[i]);
            formData.append("img", img.files[i]);
        }



        if(url === "update"){
            console.log("id3 : ", id);
            board.category = datas[0].category;
            if(delImgs.length !== 0){
                board.delImg = delImgs;
                board.likesUser = datas[0].likesUser;
                board.likes = datas[0].likes;
                console.log("id5 : ", id);
                axios.post(`/board/${id}/updateImg`, board)
                    .then((res) => {
                        if (res.data !== "fail") {
                            uploadImg(formData, id, url);
                        } else {
                            Alert.fire({
                                html: "DB 에러",
                                icon: "error",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            });
                        }
                    });
            }else{
                console.log("id4 : ", id);
                axios.post(`/board/${id}/update`, board)
                    .then((res) => {
                        if (res.data !== "fail") {
                            uploadImg(formData, id, url);
                        } else {
                            Alert.fire({
                                html: "DB 에러",
                                icon: "error",
                                confirmButtonColor: "#1976D2",
                                confirmButtonText: "확인"
                            });
                        }
                    });
            }
        }
        else{
            await axios.post('/board/write', board)
                .then((res) => {
                    if (res.data.length !== 0) {
                        console.log("res.data", res.data);
                        console.log("이미지 없으면 안들어 와야해");
                        uploadImg(formData, res.data[0], "");
                    } else {
                        Alert.fire({
                            html: "DB 에러",
                            icon: "error",
                            confirmButtonColor: "#1976D2",
                            confirmButtonText: "확인"
                        });
                    }
                });
        }
    }
    const uploadImg = async (img, data, url) => {
        if (imgList.length !== 0) {
            let cnt = 0;
            for (let key of img.keys()) {
                cnt++;
                break;
            }
            console.log("엡데이트할 이미지", img);
            console.log("엡데이트할 이미지2", img.values());
            console.log("엡데이트할 이미지리스트", imgList);

            // axios.post(`/board/write/${data[0]}/`)

            // if(cnt === 0){
            //     if(url !== "update"){
            //         window.location.href = `/boardMain/${data[1]}`;
            //     }else{
            //         window.location.href = `/board/${data[1]}/${data[0]}`;
            //     }
            // }
            console.log(data);
            await axios.post(`/board/write/${data}/img`, {
                img: imgList
            })
                .then((res) => {
                    console.log("여기로 이동.. ",res.data);
                    // window.location.href = `/boardMain/${res.data}`; // 타임이 ㅁㄴ어러나아ㅏ아아앙

                    // setTimeout(()=>{window.location.href =`/boardMain/${res.data}`}, 100);

                    // if (res.data !== "fail") {
                    //     if(url !== "update"){
                    //         window.location.href = `/boardMain/${res.data}`;
                    //     }else{
                    //         window.location.href = `/board/${res.data}/${data[0]}`;
                    //     }
                    // } else {
                    //     alert("DB Error이건가?");
                    // }
                });
        }
        setTimeout(()=>{window.location.href =`/boardMain/${JSON.parse(sessionStorage.getItem('user')).uniName}/1`}, 100);
    }
    const location = useLocation();
    useEffect(() => {
        if(props.url === "update"){
            setData([location.state]);
        }
    }, []);


    const onRemove = useCallback(
        async (e) =>{
            console.log("확인: ",datas[0].img);
            delImgs.push(e.currentTarget.id);
            datas[0].img = await datas[0].img.filter(im => im !== e.currentTarget.id)
            console.log("삭제 확인 : ", datas[0].img);
        },

        [datas],
    )


    const back =()=>{
        window.history.back();
    }
    // console.log("DeL: ", delImgs);
    return (
        <Paper sx={{maxWidth: 936, margin: 'auto', overflow: 'hidden', minHeight:"788px"}}>
        <AppBar

            position="static"
            color="default"
            style={{backgroundColor:"#dae6f1"}}
            elevation={0}
            sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)', fontWeight:"bold",}}
        ><div align={"left"} style={{margin:"20px", fontSize:"30px"}}>게시판 작성</div></AppBar>
        <div style={{width: "600px", margin: "0 auto", marginTop:"40px"}}>
            {
                props.url === "update"
                    ? (
                        datas.map(data => {
                            {console.log("여기가문제인거 같은데: "+data.img)}
                            return(
                                <>
                                    <Form.Label>제목</Form.Label>
                                    <Form.Control type="text" maxLength="30" placeholder="Title" defaultValue={data.title} name={"title"} id={"title"} required/>
                                    <hr style={{marginBottom:"30px"}}/>
                                    <Form.Label>내용</Form.Label>
                                    <textarea className="form-control" maxLength="300" name={"content"} defaultValue={data.content} placeholder={"content"} required/>
                                    <Form.Label>이미지1</Form.Label>
                                    {console.log("이미지: ", data.img.length)}
                                    {
                                        data.img.length === 0
                                            ? null
                                            :
                                            <div>
                                                {(data.img.map(im => {
                                                    return(
                                                        <>{console.log("이겅?: ",im)}
                                                            <span style={{position:'relative'}}>
                                                            <img src={im} style={{width:"200px", height:"200px", marginTop:"10px", marginBottom:"10px"}}/>
                                                            <IconButton id={im} variant='text' style={{position:'absolute',bottom:'66px', left:'170px'}}
                                                                        onClick={async (e) => {await onRemove(e); forceUpdate();}}
                                                            >
                                                                <RemoveIcon/>
                                                            </IconButton>
                                                        </span>&nbsp;&nbsp;
                                                        </>
                                                    );
                                                }))}
                                            </div>
                                    }
                                    <Form.Control type="file" placeholder="Img" multiple accept="image/*" name={"img"} />
                                </>
                            );
                        })
                    )
                    :
                    <>
                        <Form.Label>제목</Form.Label>
                        <Form.Control type="text" maxLength="30" placeholder="Title" name={"title"} id={"title"} required/>
                        <hr style={{marginBottom:"20px"}}/>
                        <Form.Label>내용</Form.Label>
                        <textarea style={{height:"400px"}} className="form-control" maxLength="300" name={"content"} placeholder={"content"} required/>
                        <Form.Label>이미지</Form.Label>
                        <Form.Control type="file" placeholder="Img" multiple accept="image/*" name={"img"} />
                    </>
            }
            <Button variant="contained"
                    onClick={(e) => onClickAction(e, props.url, params.id)}
                    style={{margin: "30px", background:"#1976D2", color:"white"}}>
                {props.url === "update" ? "수정" : "저장"}
            </Button>
            <Button variant="contained" style={{width:"86px"}} onClick={back}>Back</Button>
        </div>
        </Paper>
    );
}

export default BoardWrite;