import "../../css/sidebar/sidebarLink.css";

function SidebarLink({ text }) {
    return(
        <div className="link" style={{paddingTop:7}}>
            <h2>{text}</h2>
        </div>
    );
}
export default SidebarLink;