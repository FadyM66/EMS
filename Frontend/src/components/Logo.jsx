import '../assets/style/logo.css'

const Logo = () => {

    return (
        <div className="logo" onClick={() => window.location.href = '/home'}>
            <h2 id='logo'>EMS</h2>
        </div>
    )
}

export default Logo;
