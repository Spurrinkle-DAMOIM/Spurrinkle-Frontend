import React, {useState, useEffect} from "react";
import axios from 'axios';
import {CssBaseline, Box, Container, Button, Slide, Snackbar} from '@mui/material';
import {useNavigate, useParams} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}
export default function ContestDetail() {
    const params = useParams();
    let [name, setName] = useState(params.name);
    let [data, setData] = useState('');
    const [link, setLink] = useState("")
    const [titles, setTitle] = useState("");

    const navi = useNavigate();



    useEffect( () => {
        console.log(name)
        console.log(decodeURI(name));

        axios.get(`/crawling/getContest/${name}`, {
            params:{
                title: name
            }
        })
            .then((res) => {
                console.log(res.data);
                setData(res.data);
                setLink(res.data.link);
                setTitle(res.data.title);
            })
            .catch(error => console.log(error))
    },[])

    const createMoim = () => {
        const obj = {
            titles
        }
        navi('/meetings/createMoim', { state: {obj} });
    }


    const moveLink=(Transition)=>{
        console.log("link",link)
        // window.location.href =`${link}`;

        if (link === null){
            setTransition(() => Transition);
            setOpen(true);
        }else{
            window.open(`${link}`, '_blank');
        }
    }

    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);

    const handleClose = () => {
        setOpen(false);
    };

    return(
      <>
          <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden', height:"auto" }} >
              <AppBar
                  position="static"
                  color="default"
                  style={{backgroundColor:"#dae6f1"}}
                  elevation={0}
                  sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}
              >
                  <div align={"left"}>
                  <Button href={"/contest/1"} align={"left"} style={{paddingLeft:"20px", margin:"20px", fontSize:"34px", fontWeight:"bold", color:"black"}}>
                      공모전</Button>
                 </div>
              </AppBar>

              <Container>
                  <Box >
                      <table>
                          <tbody>
                          <tr>
                              <td colSpan={2} style={{paddingTop:15}}>
                                  <p style={{fontSize:'20px'}}><strong>{data.title}</strong></p>
                                  <hr/>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <div>
                                  <img style={{height: "24vh", width: "20vh"}}
                                       src={data.img} />
                                  </div>
                                  <div style={{marginTop:"10px"}} onClick={()=>{moveLink(TransitionLeft)}} align={"center"}><Button style={{color:"gray", fontSize:"20px"}}>접수하러 가기</Button></div>
                              </td>
                              <td style={{paddingTop:15}}>
                                  <table style={{marginLeft:35}}>
                                      <tbody>
                                      <tr>
                                          <td><strong>주최</strong></td>
                                          <td style={{paddingLeft:20}}>{data.supervise}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>주관</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:10}}>{data.sponsor}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>응모분야</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:10}}>{data.enter}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>응모대상</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:10}}>{data.target}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>주최사 유형</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:10}}>{data.hostType}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>시상규모</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:10}}>{data.scale}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>특전</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:10}}>{data.bonus}</td>
                                      </tr>
                                      <tr>
                                          <td><strong>1등혜택</strong></td>
                                          <td style={{paddingLeft:20, paddingTop:5}}>{data.benefit}</td>
                                      </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                          </tbody>
                      </table>
                  </Box>
                  {/*<div dangerouslySetInnerHTML={{ __html: data.body }}>*/}
                  {/*</div>*/}
                  <div align={"right"}  style={{margin:"20px"}}><Button variant={"contained"} onClick={createMoim}>공모전 모임 만들기</Button></div>
              </Container>
              <hr style={{width:"90%"}}/>
                  <div align={"left"} style={{marginLeft:"30px", width:"84%"}} dangerouslySetInnerHTML={{ __html: data.body }}>
                  </div>
              <br/>
              <div align={"center"}><Button variant={"contained"} style={{marginBottom:"20px"}} href="/contest/1">목록</Button></div>
          </Paper>
          {/*<CssBaseline />*/}
          {/*<Container fixed>*/}
          {/*    <Box sx={{ bgcolor: '#f0f0f0', height: '41vh', borderTop:5, borderColor:'#dbdbdb'}}>*/}
          {/*        <table>*/}
          {/*            <tbody>*/}
          {/*            <tr>*/}
          {/*                <td colSpan={2} style={{paddingTop:15}}>*/}
          {/*                    <p style={{fontSize:'20px'}}><strong>{name}</strong></p>*/}
          {/*                    <hr width={"600vh"}/>*/}
          {/*                </td>*/}
          {/*            </tr>*/}
          {/*            <tr>*/}
          {/*                <td>*/}
          {/*                    <img style={{height: "20vh", width: "15vh"}}*/}
          {/*                         src={data.img} />*/}
          {/*                </td>*/}
          {/*                <td style={{paddingTop:15}}>*/}
          {/*                    <table style={{marginLeft:35}}>*/}
          {/*                        <tbody>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>주최</strong></td>*/}
          {/*                            <td style={{paddingLeft:20}}>{data.supervise}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>주관</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.sponsor}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>응모분야</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.enter}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>응모대상</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.target}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>주최사 유형</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.hostType}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>시상규모</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.scale}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>특전</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.bonus}</td>*/}
          {/*                        </tr>*/}
          {/*                        <tr>*/}
          {/*                            <td><strong>1등혜택</strong></td>*/}
          {/*                            <td style={{paddingLeft:20, paddingTop:5}}>{data.benefit}</td>*/}
          {/*                        </tr>*/}
          {/*                        </tbody>*/}
          {/*                    </table>*/}
          {/*                </td>*/}
          {/*            </tr>*/}
          {/*            </tbody>*/}
          {/*        </table>*/}
          {/*    </Box>*/}
          {/*    <div dangerouslySetInnerHTML={{ __html: data.body }}>*/}
          {/*    </div>*/}
          {/*    <Button variant={"contained"} onClick={createMoim}>공모전 모임 만들기</Button>*/}
          {/*</Container>*/}
          <Snackbar
              open={open}
              onClose={handleClose}
              TransitionComponent={transition}
              message="이메일 접수를 이용해 주세요!"
              key={transition ? transition.name : ''}
          />
      </>
    );
};