import SidebarLinkRelated from "../SidebarLinkRelated";
import React from "react";
import Badge from '@mui/material/Badge';
import SidebarLink from "../../sidebar/SidebarLink.js";
export function LinkBar(props){
    return(
        <a onClick={props.onClickMet}
           style={{color:"#000000", textDecorationLine:"none"}}>
            {
                props.bold === "bold"
                ? <SidebarLink text={props.text} />
                   : <SidebarLinkRelated text={props.text}/>
            }
        </a>
    )
}
export function BadgeCompo(props){
    return(
        <div align={"left"}>
            <Badge badgeContent={props.appLen} color="primary">
                <a onClick={props.onClickMet} style={{color:"#000000", textDecorationLine:"none"}}><SidebarLinkRelated text={props.linkText}/></a>
            </Badge>
        </div>
    )
}