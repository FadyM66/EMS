import '../assets/style/addprompt.css'
import { useFormik } from 'formik';
import { company } from '../utils/schema.js';
import fetcher from '../utils/fetcher.js';
import { handleCancel } from '../utils/handlers.js';
import InputRow from './InputRow.jsx';


const AddCompany = ({ isAdd, setAdd, refreshData }) => {
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
        },
        validationSchema: company,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
                const { response } = await fetcher(
                    'http://localhost:8000/company/add',
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

    return (
        <>
            <div className="card-container">
                <div className="main-card">
                    <div className="login-text">
                        <h1>New Conpany</h1>
                        <p>Fill the form to add a new company</p>
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
                                placeholder="Enter the company name"
                            />
                            <div className='company-options'>
                                <button type='submit' className='option-btn'>add</button>
                                <button className='option-btn'
                                    onClick={() => {
                                        handleCancel(setAdd, resetForm)
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

export default AddCompany;
