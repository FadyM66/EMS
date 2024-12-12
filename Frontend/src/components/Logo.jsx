import '../assets/style/logo.css'

const Logo = () => {
    return (
        <>
            <div className="logo" onClick={()=> window.location.href = '/home'}>
                <h2>EMS</h2>
            </div>
        </>
    )
}


export default Logo;