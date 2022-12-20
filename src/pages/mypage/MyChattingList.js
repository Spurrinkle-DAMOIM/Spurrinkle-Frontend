import {Avatar,Pagination, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import getDate from "../board/BoardDate";
import DateMake from "../../component/DateMake";
import AppBar from "@mui/material/AppBar";

export default function MyChattingList() {
    const params = useParams();
    let [page, setPage] = useState(params.page);
    const navigate = useNavigate();
    const [state,updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), {});
    const [totalPage, setTotalPage] = useState('');

    const [datas, setData] = useState([]);
    const [dataimg, setDataImg] = useState([]);

    useEffect(() => {
        if(parseInt(page) < 0 || isNaN(parseInt(page))){
            console.log("0보다 작음",parseInt(page));
            navigate(`/myPage/chatting/${1}`);
            page = 1;
            setPage(1);
            forceUpdate();
        }
        axios.post(`/chat/rooms/${page}`, {
            id: sessionStorage.getItem('id'),
        })
            .then((res) => {
                console.log("채팅 리스트 : ",res.data);
                // console.log("채팅 리스트2 : ",res.data.content[0].chats[0].message);
                setData(res.data.content);
                setTotalPage(res.data.totalPages);
                console.log(DateMake("날짜 : ",res.data.content.date));
                getImg(res.data.content);
            })
    },[]);

    const getImg = async (data) => {
        console.log("data: "+ data);
        for(let i=0; i< data.length; i++) {
            console.log("반복");
            if (data[i].name !== "익명 채팅방") {
                console.log("이러면 안옴", data[i].name);
                await axios.get(`/Moim/${data[i].name}/moimDetail`)
                    .then(async(res) => {
                        console.log(res.data)
                        dataimg.push(res.data.img);
                        setDataImg([...dataimg , dataimg]);
                        // return res.data.img;
                    })
            }else{
                dataimg.push("https://frameworklab.imweb.me/common/img/default_profile.png");
            }
        }
        console.log("img", dataimg);
    }

    return (
      <>
          <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto", minHeight:"694px"}} >
              <AppBar
                  position="static"
                  color="default"
                  style={{backgroundColor:"#dae6f1"}}
                  elevation={0}
                  sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
              >
                  <div  align={"left"} style={{paddingLeft:"20px", marginTop:"20px", marginBottom:"20px" ,fontWeight:"bold", fontSize:"34px"}}>채팅 목록</div>
              </AppBar>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                      <TableRow>
                          <TableCell align={"center"}>프로필</TableCell>
                          <TableCell align={"center"}>방 이름</TableCell>
                          <TableCell align={"center"}>채팅 내역&nbsp;</TableCell>
                          <TableCell align={"center"}>날짜&nbsp;</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {datas.map((row, index) => (
                          <TableRow
                              key={row.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              onClick={()=>{
                                  row.whether ? window.location.href = `/meeting/${row.roomId}/chat` : window.location.href = `/chat/${row.roomId}`
                              }}
                              style={{cursor : 'pointer'}}
                          >
                              <TableCell align={"center"}>
                                  <Avatar
                                      src={dataimg[index]}
                                      style={{margin:'10px'}}
                                      sx={{ width: 55, height: 55}}
                                  />
                              </TableCell>
                              <TableCell align={"center"}>{row.name}</TableCell>
                              <TableCell align={"center"}>{row.chats.length === 0 ? "채팅 없음" : row.chats[row.chats.length -1].message}</TableCell>
                              <TableCell align={"center"}>{DateMake(row.lastDate)}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>

          </Paper>
          <div style={{paddingTop:"10px"}}>
          <Stack spacing={2}>
              <Pagination style={{paddingLeft:"356px"}} count={totalPage} showFirstButton showLastButton
                          defaultPage={ parseInt(page)} boundaryCount={3}
                          onChange={(e, value) =>
                          {
                              setPage(value);
                              window.location.href=`/myPage/chatting/${value}`;
                          }}
                          onClick={(e,p) => {console.log(p);}}/>
          </Stack>
          </div>
      </>  
    );
};
