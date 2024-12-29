import '../assets/style/footer.css';
import Cookies from 'js-cookie';

const Footer = () => {

        const Name = Cookies.get('name')
        const Role = Cookies.get('role')

    return (
        <>
            <footer>
                <div className="name">
                    Name: <span>{Name}</span>
                </div>
                <div className="role">
                    Role: <span>{Role}</span>
                </div>
            </footer>
        </>
    )
}

export default Footer;