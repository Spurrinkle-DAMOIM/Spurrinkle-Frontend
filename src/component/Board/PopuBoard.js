import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import getDate from "../../pages/board/BoardDate";

function PopuBoard(props){
    const uni = props.uni;
    const [popus, setPopus] = useState([]); // 인기 게시글
    const getPopu = async () => {
        await axios.get(`/board/${uni}/popu`)
            .then(res => {
                setPopus(res.data)
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        getPopu();
    }, []);
    return(
        <>
            {
                popus.length === 0
                    ? <><div>This week's hot post does not exist.</div></>
                    : (popus.map((po, index) => {
                        return(
                            <>
                                <div style={{fontSize:'17px', marginTop:"-8px"}}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={1}/>
                                        <Grid item xs={2}>
                                                        <span style={{fontStyle:'italic', fontWeight:'bold', color:'skyblue', fontSize:"22px"}}>
                                                             {index+1}.
                                                        </span></Grid>
                                        <Grid item xs={7}>
                                                        <span>
                                                            <a href={`/board/${uni}/${po.id}`}
                                                               style={{marginTop:"4px" ,textDecoration: 'none', color: 'black', overflow: "hidden",
                                                                   textOverflow:"ellipsis",
                                                                   whiteSpace: "nowrap",
                                                                   display: "block",
                                                                   wordBreak:"break-word"}}>{po.title}</a>
                                                        </span>

                                        </Grid>
                                        <Grid item xs={2}>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div align={"center"}><hr style={{width:"90%"}}/></div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </>
                        )
                    }))
            }
        </>
    )
}
export default PopuBoard;