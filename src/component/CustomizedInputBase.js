import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


function CustomizedInputBase(props) {
    return (
        <Paper
            component="form"
            sx={{ p: '1px 4px', display: 'flex', alignItems: 'center', width: '97%' }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="검색어를 입력하세요"
                inputProps={{ 'aria-label': 'search google maps' }}
                name={"searchBoard"}
            />
            <IconButton type="button" sx={{ p: '7px' }} aria-label="search" onClick={props.onClick}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
export default CustomizedInputBase;