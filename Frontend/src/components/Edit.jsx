import { useEffect, useState } from "react"
import { handleViewData, handleUpdate } from "../utils/handlers"
import { useFormik } from "formik"
import * as schemas from '../utils/editschema'
import InputRow from "./InputRow"
import Status from './Status'
import DepartmentRow from './DepartmentRow'
import '../assets/style/view.css'

const Edit = ({ isOpen, which, setIsOpen, editData, setEditData, refreshData }) => {

    const [loading, setLoading] = useState(true);

    const urls = {
        "company": `http://localhost:8000/company/edit/${editData?.id}`,
        "department": `http://localhost:8000/department/edit/${editData?.id}`,
        "employee": `http://localhost:8000/employee/edit/${editData?.id}`,
        "user": `http://localhost:8000/user/edit/${editData?.id}`
    }

    const forms = {
        "company": ["name"],
        "department": ["name"],
        "employee": ['name', "email", "mobile_number", "address", "designation", "status", "department_id"],
        "user": ["username", "email", "password", "role"]
    }

    const fields = forms[which]

    const url = urls[which]


    const initialValues = Object.fromEntries(fields.map(field => [field, ""]));

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: schemas[which],
        onSubmit: (values, { resetForm }) => {
            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(([key, value]) => value.trim() !== "")
            );
            handleUpdate(url, filteredValues, setIsOpen, refreshData, resetForm);
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

    if (isOpen != 'edit') return null;

    return (
        <>
            <div className="card-container">
                <div className="main-card">

                    <div className="login-text">
                        <h1>{editData?.name || ""}</h1>
                    </div>

                    <div className="cardform">
                        <form onSubmit={handleSubmit}>
                            <div >
                                {
                                    fields.map(
                                        (field) => {
                                            if (field == 'status') {
                                                return (
                                                    <Status 
                                                    key={field} 
                                                    value={values.status}
                                                    onChange={()=>handleChange()}
                                                    errors={errors}
                                                    touched={touched}
                                                    />
                                                )
                                            }
                                            else if (field == 'department_id') {
                                                return (
                                                        <DepartmentRow 
                                                        key={field} 
                                                        value={values.department_id}
                                                        onChange={()=>handleChange()}
                                                        errors={errors}
                                                        touched={touched}
                                                        />
                                                )
                                            }
                                            else {
                                                return (
                                                        <InputRow
                                                            key={field}
                                                            values={values[field]}
                                                            handleChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            errors={errors}
                                                            touched={touched}
                                                            htmlFor={field}
                                                            label={field}
                                                            inputId={field}
                                                            name={field}
                                                            type="text"
                                                            placeholder={`Enter the ${field}`}
                                                        />
                                                )
                                            }
                                        }
                                    )
                                }
                                <div className='company-options'>
                                    <button type="submit" className='option-btn'>Save</button>
                                    <button className='option-btn' onClick={() => setIsOpen(null)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Edit;
