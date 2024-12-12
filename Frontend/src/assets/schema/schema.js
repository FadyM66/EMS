import * as yup from 'yup';

const phoneRules = /^(010|011|012|015)[0-9]{8}$/;

export const loginSchema = yup.object().shape({
    email: yup.string().required("Required"),
    password: yup.string().required("Required")
})

export const addcompany = yup.object().shape({
    name: yup.string().min(3,'min length 3 characters').required("Required"),
    company_id: yup.string().required('Required')
})

export const addemployee = yup.object().shape({
    name: yup.string().min(4,'min length 4 characters').required("Required"),
    email: yup.string().email('Please enter a valid email').required('Required'),
    mobile_number: yup.string().matches(phoneRules, 'Please enter a valid phone number').required("Required"),
    address: yup.string().required("Required"),
    designation: yup.string().required("Required"),
    status: yup.string().required("Required"),
    department_id: yup.string().required("Required")
})