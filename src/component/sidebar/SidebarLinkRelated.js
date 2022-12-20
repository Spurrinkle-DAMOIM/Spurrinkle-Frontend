import "../../css/sidebar/sidebarLink.css";

function SidebarLink({ text }) {
    return(
        <div className="link">
            <h6>{text}</h6>
        </div>
    );
}
export default SidebarLink;