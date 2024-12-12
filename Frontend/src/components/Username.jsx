import Cookies from "js-cookie"
import '../assets/style/username.css'

const Username = () => {
    return (
        <>
            <div id="topright">
                <h4>{Cookies.get('name')}</h4>
                <p id="signout" onClick={() => {
                    Cookies.remove('token');
                    window.location.href = "/"
                    }}>Sign out</p>
            </div>
        </>
    )
}

export default Username;