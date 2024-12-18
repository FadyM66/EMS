import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import Logo from '../components/Logo.jsx';
import '../assets/style/login.css';
import { loginSchema } from '../assets/schema/schema.js';
import fetcher from '../utils/fetcher.js';
import Cookies from 'js-cookie';
import InputRow from '../components/InputRow.jsx';

const Login = () => {

    useEffect(() => {
        if (Cookies.get('token')) {
            window.location.href = '/home'
        }
    }, []);

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldError,
    } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values, { setSubmitting }) => {

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
                    window.location.href = '/home'
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

        },
    });

    return (
        <>
            <Logo />
            <div className="login-card">
                <div className="login-text">
                    <h1>Sign in to EMS</h1>
                    <p>Welcome back! Please sign in to continue</p>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <InputRow
                            values={values}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            errors={errors}
                            touched={touched}
                            htmlFor="email"
                            label="Email"
                            inputId="login-email"
                            name="email"
                            type="email"
                            placeholder="Enter an Email"
                        />
                        <InputRow
                            values={values}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            errors={errors}
                            touched={touched}
                            htmlFor="login-password"
                            label="Password"
                            inputId="login-password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                        <button type="submit" disabled={isSubmitting}>
                            <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;