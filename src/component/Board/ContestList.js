import React, {useEffect, useState} from "react";
import axios from "axios";
import {Grid} from "@mui/material";

function ContestList(){
    const [contest, setContest] = useState([]); // 공모전
    const getContest = async () => {
        await axios.get(`/crawling/contestList`)
            .then(res => {
                console.log("공모전 리스트: ", res.data);
                setContest(res.data)
            })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        getContest();
    }, []);
    return(
        <>
            {
                contest.length === 0
                    ? <><div>This week's does not exist.</div></>
                    : (contest.map((po, index) => {
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
                                                            <a href={`/contest/detail/${po.id}`}
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
export default ContestList;