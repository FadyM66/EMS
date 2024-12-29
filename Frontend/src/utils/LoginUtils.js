import Cookies from 'js-cookie';
import fetcher from './fetcher';

export const handleLoginSubmit = async (values, { setSubmitting, setFieldError }, navigate) => {

    setSubmitting(true);
    try {
        const { response, data } = await fetcher(
            'http://localhost:8000/user/login',
            "POST",
            values,
            true
        )
        if (response.status == 200) {
            Cookies.set("token", data.data.token)
            Cookies.set("role", data.data.data.role)
            Cookies.set("name", data.data.data.username)
            navigate('/home')
        }
        else if (response.status == 401) {
            setFieldError('password', "invalid password")
        }
        else if (response.status == 404) {
            setFieldError('email', "user not found")
        }
        else {
            setFieldError('password', "try again later")
        }
        setSubmitting(false);
    }
    catch (error) {
        setFieldError('password', 'try again later')
    }

}