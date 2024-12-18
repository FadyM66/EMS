import '../assets/style/addcompany.css'
import { useFormik } from 'formik';
import { addcompany } from '../assets/schema/schema.js';
import fetcher from '../utils/fetcher.js';
import { useEffect, useState } from 'react';

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
        validationSchema: addcompany,
        onSubmit: async (values, { setSubmitting, resetForm }) => {

            setSubmitting(true);
            try {
                console.log("values: ", values)
                const { response, data } = await fetcher(
                    'http://localhost:8000/department/add',
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
                        <h1>New Department</h1>
                        <p>Fill the form to add a new department</p>
                    </div>
                    <div className="cardform">
                        <form onSubmit={handleSubmit}>
                            <div >
                                <label>name</label>
                                <input type="text"
                                    style={{ marginBottom: "1rem" }}
                                    id='name'
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter the name`}
                                    className={errors.name && touched.name ? "error" : null}
                                />
                            </div>
                            {errors.name && touched.name && (
                                <p className="error">{errors.name}</p>
                            )}

                            <label>companies</label>
                            <select id="company_id" value={values.company_id} onChange={handleChange} name="company_id">
                                <option className='op' >Select a company</option>
                                {
                                    companies.map((company) => (

                                        <option className='op' key={company.id} value={company.id}>{company.name}</option>

                                    ))}
                            </select>

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

export default AddDepartment;
