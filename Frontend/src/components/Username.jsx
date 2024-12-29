import Cookies from "js-cookie"
import '../assets/style/username.css'

const Username = () => {
    return (
        <>
            <div id="topright">
                <p id="signout" onClick={() => {
                    Cookies.remove('token');
                    Cookies.remove('name');
                    Cookies.remove('role');
                    window.location.href = "/"
                    }}>Sign out</p>
            </div>
        </>
    )
}

export default Username;