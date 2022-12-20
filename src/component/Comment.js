import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";


function Comment(props) {
    return (
        <Paper
            component="form"
            sx={{ p: '1px 4px', display: 'flex', alignItems: 'center', width: '97%' }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="댓글을 달아주세요!"
                inputProps={{ 'aria-label': 'search google maps' }}
                name={"reReply-content"}
            />
            <IconButton type="button" sx={{ p: '7px' }} aria-label="search" id={props.id} onClick={props.onClick}>
                <FontAwesomeIcon style={{color: "gray", marginLeft:"8px", paddingTop:"2px"}}
                                  icon={faPaperPlane}/>
            </IconButton>
        </Paper>
    );
}
export default Comment;