import '../assets/style/addcompany.css'
import { useFormik } from 'formik';
import { addemployee } from '../assets/schema/schema.js';
import fetcher from '../utils/fetcher.js';
import { useEffect, useState } from 'react';
import InputRow from './InputRow.jsx';


const AddEmployee = ({ isAdd, setAdd, refreshData }) => {

    const [departments, setDepartments] = useState([])

    useEffect(
        () => {
            const x = async () => {
                const { response, data } = await fetcher("http://localhost:8000/department/", "GET");
                setDepartments(data.detail?.data)
            };

            x()
        }
        , []
    )

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldError,
        resetForm
    } = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobile_number: "",
            address: "",
            designation: "",
            status: "",
            department_id: ""
        },
        validationSchema: addemployee,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            console.log("values: ", values)

            setSubmitting(true);
            try {
                const { response, data } = await fetcher(
                    'http://localhost:8000/employee/add',
                    "POST",
                    values,
                    false
                )
                console.log("res: ", response)
                console.log("data: ", data)
                if (response.status == 200) {
                    setAdd(false)
                    refreshData()
                    resetForm()
                }
                else {
                    setFieldError('password', "try again later")
                }
                setSubmitting(false);
            }
            catch (error) {
                setFieldError('name', 'try again later')
            }

        },
    });

    if (!isAdd) {
        return null
    }

    const canceladd = (resetForm) => {
        setAdd(false);
        resetForm();
    };

    return (
        <>
            <div className="card-container">
                <div className="main-card">

                    <div className="login-text">
                        <h1>New Employee</h1>
                        <p>Fill the form to add a new employee</p>
                    </div>

                    <div className="cardform">
                        <form onSubmit={handleSubmit}>
                            <div >
                                <InputRow
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                    htmlFor="name"
                                    label="Name"
                                    inputId="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter the name"
                                />
                                <InputRow
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                    htmlFor="email"
                                    label="Email"
                                    inputId="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter the email"
                                />
                                <InputRow
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                    htmlFor="mobile_number"
                                    label="Mobile number"
                                    inputId="mobile_number"
                                    name="mobile_number"
                                    type="text"
                                    placeholder="Enter the Mobile number"
                                />
                                <InputRow
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                    htmlFor="address"
                                    label="Address"
                                    inputId="address"
                                    name="address"
                                    type="text"
                                    placeholder="Enter the address"
                                />
                                <InputRow
                                    values={values}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    errors={errors}
                                    touched={touched}
                                    htmlFor="designation"
                                    label="Designation"
                                    inputId="designation"
                                    name="designation"
                                    type="text"
                                    placeholder="Enter the designation"
                                />
                                <div className='row'>
                                    <label>Status</label>
                                    <select id="status" value={values.status} onChange={handleChange} name="status"
                                        className={errors.status && touched.status ? "error" : null}
                                    >
                                        <option className='op' value="">Select a status</option>
                                        <option className='op' value="application_received">application_received</option>
                                        <option className='op' value="interview_scheduled">interview_scheduled</option>
                                        <option className='op' value="hired">hired</option>
                                        <option className='op' value="not_accepted">not_accepted</option>
                                    </select>
                                    {errors.status && touched.status && (<p className="error">{errors.status}</p>)}
                                </div>

                                <div className='row'>
                                    <label>departments</label>
                                    <select id="department_id" value={values.department_id} onChange={handleChange} name="department_id"
                                        className={errors.department_id && touched.department_id ? "error" : null}
                                    >
                                        <option className='op' >Select a department</option>
                                        {
                                            departments.map((department) =>
                                            (
                                                <option className='op' key={department.id} value={department.id}>{department.name}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.department_id && touched.department_id && (<p className="error">{errors.department_id}</p>)}
                                </div>

                                <div className='compant-options'>
                                    <button type='submit' className='option-btn'>add</button>
                                    <button className='option-btn'
                                        onClick={() => {
                                            canceladd(resetForm)
                                            setFieldError('name', null)
                                        }}>cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEmployee;
