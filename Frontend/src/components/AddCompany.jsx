import '../assets/style/addcompany.css'
import { useFormik } from 'formik';
import { addcompany } from '../assets/schema/schema.js';
import fetcher from '../assets/utils/fetcher.js';

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
        validationSchema: addcompany,
        onSubmit: async (values, { setSubmitting, resetForm }) => {

            setSubmitting(true);
            try {
                const { response, data } = await fetcher(
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
                        <h1>New Conpany</h1>
                        <p>Fill the form to add a new company</p>
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
                            </div>
                            {errors.name && touched.name && (
                                <p className="error">{errors.name}</p>
                            )}
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

export default AddCompany;
