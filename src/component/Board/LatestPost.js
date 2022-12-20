import React, {useEffect, useState} from "react";
import axios from "axios";
import getDate from "../../pages/board/BoardDate";
import {Grid} from "@mui/material";
import {faComment, faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function LatestPost(props){
    const uni = props.uni;
    const [latestPost, setLatestPost] = useState([]); // 최신 게시글
    const getLatestPost = async () => {
        await axios.get(`/board/${uni}/latestPost`)
            .then(res => {
                setLatestPost(res.data)
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        getLatestPost();
    }, []);
    return(
        <>
            {
                latestPost.length === 0
                    ? <><div>This week's post does not exist.</div></>
                    : (latestPost.map((po, index) => {
                        return(
                            <>
                                <div style={{fontSize:'17px'}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={1}></Grid>
                                        <Grid item xs={1}>
                                            <div style={{marginTop:"10px", fontStyle:'italic', fontWeight:'bold', color:'skyblue', fontSize:"20px"}}>{index+1}.</div>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <div align={"left"}>
                                                <a href={`/board/${uni}/${po.id}`} style={{marginTop:"12px",textDecoration: 'none', color: 'black', fontSize:"17px", fontWeight:"bold",
                                                    overflow: "hidden",
                                                    textOverflow:"ellipsis",
                                                    whiteSpace: "nowrap",
                                                    display: "block",
                                                    wordBreak:"break-word"}}>{po.title}</a>
                                            </div>
                                        </Grid>
                                        <Grid item xs={1}/>
                                        <Grid item xs={9}>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{marginRight:"10px", marginTop:"-10px"}}>
                                            <FontAwesomeIcon style={{color: "#8B0000", width:"14px", height:"14px", marginLeft:'5px'}} icon={faThumbsUp} />
                                            &nbsp;<span style={{color: "#8B0000", fontSize:"10px"}}>{po.likes}</span> &nbsp;
                                            <FontAwesomeIcon style={{color: "#4169E1", width:"14px", height:"14px"}} icon={faComment} />
                                                &nbsp;<span style={{color: "#4169E1", fontSize:"10px"}}>{po.replyCnt}</span>
                                            </div>
                                        </Grid>
                                        {/*<Grid item xs={3}>*/}
                                        {/*                <span style={{fontFamily:"ImcreSoojin", fontSize:"30px" ,fontWeight:'bold', color:'skyblue'}}>*/}
                                        {/*                     {index+1}.*/}
                                        {/*                </span></Grid>*/}
                                        {/*<Grid item xs={6}>*/}
                                        {/*                <span>*/}
                                        {/*                    <a href={`/board/${uni}/${po.id}`} style={{textDecoration: 'none', color: 'black'}}>{po.title}</a>*/}
                                        {/*                </span>*/}

                                        {/*</Grid>*/}
                                        {/*<Grid item xs={3}>*/}
                                        {/*</Grid>*/}
                                        {/*<Grid item xs={1}/>*/}
                                    </Grid>
                                    <div align={"center"} style={{marginTop:"-14px"}}><hr style={{width:"90%"}}/></div>
                                </div>


                            </>
                        )
                    }))
            }
        </>
    )
}
export default LatestPost;