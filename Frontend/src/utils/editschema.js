import * as yup from 'yup';

const phoneRules = /^(010|011|012|015)[0-9]{8}$/;

export const company = yup.object().shape({
    name: yup.string().min(3, 'min length 3 characters')
        .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces are allowed')
})

export const department = yup.object().shape({
    name: yup.string().min(2, 'min length 2 characters')
        .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces are allowed')
})

export const employee = yup.object().shape({
    name: yup.string().min(4, 'min length 4 characters'),
    email: yup.string().email('Please enter a valid email'),
    mobile_number: yup.string().matches(phoneRules, 'Please enter a valid phone number'),
    address: yup.string(),
    designation: yup.string(),
    status: yup.string(),
    department_id: yup.string()
})