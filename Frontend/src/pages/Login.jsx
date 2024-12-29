import { useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { loginSchema } from '../utils/schema.js';

import Cookies from 'js-cookie';

import InputRow from '../components/InputRow.jsx';
import Logo from '../components/Logo.jsx';
import { GeneralContext } from '../context/GeneralContext.jsx';
import { handleLoginSubmit } from '../utils/LoginUtils.js';

import '../assets/style/login.css';


const Login = () => {

    const { navigate } = useContext(GeneralContext);

    useEffect(() => {
        if (Cookies.get('token')) {
            navigate('/home')
        }
    }, []);

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: (values, formikHelpers) => handleLoginSubmit(values, formikHelpers, navigate),
    });

    return (
        <>
            <Logo />
            <div className="login-card">
                <div className="login-text">
                    <h1 className='prompt-h1'>Sign in to EMS</h1>
                    <p className='prompt-p'>Welcome back! Please sign in to continue</p>
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
                        <button id='signin-btn' type="submit" disabled={isSubmitting}>
                            <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;