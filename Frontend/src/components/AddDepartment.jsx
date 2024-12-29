import '../assets/style/addprompt.css'
import { useFormik } from 'formik';
import { department } from '../utils/schema.js';
import fetcher from '../utils/fetcher.js';
import { useEffect, useState } from 'react';
import InputRow from './InputRow.jsx';

const AddDepartment = ({ isAdd, setAdd, refreshData }) => {

    const [companies, setCompanies] = useState([])

    useEffect(
        () => {
            const x = async () => {
                const { response, data } = await fetcher("http://localhost:8000/company/", "GET");
                setCompanies(data.detail?.data)
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
            company_id: ""
        },
        validationSchema: department,
        onSubmit: async (values, { setSubmitting, resetForm }) => {

            setSubmitting(true);
            try {
                const { response, data } = await fetcher(
                    'http://localhost:8000/department/add',
                    "POST",
                    values,
                    false
                )
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

    if (isAdd != 'add') {
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
                        <h1>New Department</h1>
                        <p>Fill the form to add a new department</p>
                    </div>
                    <div className="cardform">
                        <form onSubmit={handleSubmit}>
                            <InputRow
                                values={values}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                errors={errors}
                                touched={touched}
                                htmlFor="name"
                                label="Name"
                                name="name"
                                type="text"
                                placeholder="Enter the department name"
                            />
                            <div className='select-company'>
                                <label>companies</label>
                                <select value={values.company_id} onChange={handleChange} name="company_id">
                                    <option className='op' >Select a company</option>
                                    {
                                        companies.map((company) => (

                                            <option className='op' key={company.id} value={company.id}>{company.name}</option>

                                        ))}
                                </select>
                            </div>
                            <div className='department-options'>
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

export default AddDepartment;
