import '../assets/style/addcompany.css'
import { useFormik } from 'formik';
import { addemployee } from '../assets/schema/schema.js';
import fetcher from '../assets/utils/fetcher.js';
import { useEffect, useState } from 'react';

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

                                <label>name</label>
                                <input type="text"
                                    id='name'
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter the name`}
                                    className={errors.name && touched.name ? "error" : null}
                                />
                                {errors.name && touched.name && (<p className="error">{errors.name}</p>)}


                                <label>email</label>
                                <input type="text"
                                    id='email'
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter the email`}
                                    className={errors.email && touched.email ? "error" : null}
                                />
                                {errors.email && touched.email && (<p className="error">{errors.email}</p>)}


                                <label>Mobile number</label>
                                <input type="text"
                                    id='mobile_number'
                                    name='mobile_number'
                                    value={values.mobile_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter the Mobile number`}
                                    className={errors.mobile_number && touched.mobile_number ? "error" : null}
                                />
                                {errors.mobile_number && touched.mobile_number && (<p className="error">{errors.mobile_number}</p>)}


                                <label>Address</label>
                                <input type="text"
                                    id='address'
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter the address`}
                                    className={errors.address && touched.address ? "error" : null}
                                />
                                {errors.address && touched.address && (<p className="error">{errors.address}</p>)}


                                <label>Designation</label>
                                <input type="text"
                                    id='designation'
                                    value={values.designation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter the designation`}
                                    className={errors.designation && touched.designation ? "error" : null}
                                />
                                {errors.designation && touched.designation && (<p className="error">{errors.designation}</p>)}


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
                            </div>
                            {errors.status && touched.status && (<p className="error">{errors.status}</p>)}


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


                            <div className='compant-options'>
                                <button type='submit' className='option-btn'>add</button>
                                <button className='option-btn'
                                    onClick={() => {
                                        canceladd(resetForm)
                                        setFieldError('name', null)
                                    }}>cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEmployee;
