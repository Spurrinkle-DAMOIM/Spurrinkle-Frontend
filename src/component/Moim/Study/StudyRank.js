import {Grid} from "@mui/material";
import * as React from "react";

function StudyRank(props){
    const data = props.data;
    const userData = props.userData;
    if(props.num === 1){
        return(
            <>
                {
                    data[2] === undefined
                        ? <Grid item xs={4}></Grid>
                        : <>
                            {
                                Object.entries(userData[2]).map((key, idx) => {
                                    return(
                                        <>
                                            {
                                                key[1] !== "00H:00M:00S" && data[2].id !== undefined
                                                    ? <Grid item xs={4}>
                                                        <div style={{paddingTop:"240px"}}>
                                                            <div>{data[2].id}</div>
                                                            <img style={{height: "100%", width: "100px"}}
                                                                 src={data[2].img}/>
                                                            <table style={{width:"100%", height:"30px",marginTop:"10px",  backgroundColor:"#1C2D4E",borderCollapse:"collapse", borderRadius: "2px"}}>
                                                            </table>
                                                            <table style={{width:"100%", height:"350px", marginTop:"6px", backgroundColor:"#2D4575",borderCollapse:"collapse", borderRadius: "10px"}}>
                                                                <tr>
                                                                    <td>
                                                                        <div align={"center"} style={{color:"white", fontWeight:"bold", fontFamily:"ImcreSoojin", fontSize:"60px"}}>3</div>
                                                                    </td>
                                                                </tr><br/><br/><br/><br/><br/><br/><br/>
                                                            </table>
                                                        </div>
                                                    </Grid>
                                                    : <Grid item xs={4}></Grid>
                                            }
                                        </>
                                    )
                                })
                            }
                        </>

                }
            </>
        )
    }else if(props.num === 2){
        return(
            <>
                {
                    data[0] === undefined
                        ? <Grid item xs={4}></Grid>
                        : <>
                            {
                                Object.entries(userData[0]).map((key, idx) => {
                                    return(
                                        <>
                                            {
                                                key[1] !== "00H:00M:00S" && data[0].id !== undefined
                                                    ? <Grid item xs={4}>
                                                        <div style={{paddingTop:"90px"}}>
                                                            <div>{data[0].id}</div>
                                                            <img style={{height: "100%", width: "100px"}}
                                                                 src={data[0].img}/>
                                                            <table style={{width:"100%", height:"30px",marginTop:"10px",  backgroundColor:"#7787BB",borderCollapse:"collapse", borderRadius: "2px"}}>
                                                            </table>
                                                            <table style={{width:"100%", height:"350px", marginTop:"6px",  backgroundColor:"#A3ADD0",borderCollapse:"collapse", borderRadius: "10px"}}>
                                                                <tr>
                                                                    <td>
                                                                        <div align={"center"} style={{color:"white", fontWeight:"bold", fontFamily:"ImcreSoojin", fontSize:"60px"}}>1</div>
                                                                    </td>
                                                                </tr><br/><br/><br/><br/><br/><br/><br/>
                                                            </table>
                                                        </div>
                                                    </Grid>
                                                    : <Grid item xs={4}></Grid>
                                            }
                                        </>
                                    )
                                })
                            }
                        </>
                }
            </>
        )
    }else if(props.num === 3){
        return(
            <>
                {
                    data[1] === undefined
                        ? <Grid item xs={4}></Grid>
                        : <>
                            {
                                Object.entries(userData[1]).map((key, idx) => {
                                    return(
                                        <>
                                            {
                                                key[1] !== "00H:00M:00S" && data[1].id !== undefined
                                                    ? <Grid item xs={4}>
                                                        <div style={{paddingTop:"180px"}}>
                                                            <div>{data[1].id}</div>
                                                            <img style={{height: "70%", width: "100px"}}
                                                                 src={data[1].img}/>
                                                            <table style={{width:"100%", height:"30px",marginTop:"10px",  backgroundColor:"#59B9C5",borderCollapse:"collapse", borderRadius: "2px"}}>
                                                            </table>
                                                            <table style={{width:"100%", height:"350px", marginTop:"6px", backgroundColor:"#6FD6E0",borderCollapse:"collapse", borderRadius: "10px"}}>
                                                                <tr>
                                                                    <td>
                                                                        <div align={"center"} style={{color:"white", fontWeight:"bold", fontFamily:"ImcreSoojin", fontSize:"60px"}}>2</div>
                                                                    </td>
                                                                </tr><br/><br/><br/><br/><br/><br/><br/>
                                                            </table>
                                                        </div>
                                                    </Grid>
                                                    : <Grid item xs={4}></Grid>
                                            }
                                        </>
                                    )
                                })
                            }
                        </>
                }
            </>
        )
    }
}
export default StudyRank;