import '../assets/style/topbar.css'

const TopBar = () => {

    return (
        <>
    <div id="topbar">
        <nav>
            <ul className="nav-bar">
                <li onClick={()=>window.location.href = "/companies"}>companies</li>
                <li onClick={()=>window.location.href = "/departments"}>departments</li>
                <li onClick={()=>window.location.href = "/employees"}>employees</li>
                {/* <li onClick={()=>window.location.href = "/users"}>users</li> */}
            </ul>
        </nav>
    </div>
        </>
    );
}

export default TopBar;