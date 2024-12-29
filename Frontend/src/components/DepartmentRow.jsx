import { useEffect, useState } from "react";
import fetcher from "../utils/fetcher";

const DepartmentRow = ({ key, value, onChange, errors, touched }) => {

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
    return (
        <>
            <div className='row' key={key}>
                <label>departments</label>
                <select id="department_id" value={value} onChange={onChange} name="department_id"
                    className={errors.department_id && touched.department_id ? "error" : null}
                >
                    <option className='op' >Select a department</option>
                    {
                        departments.map((department, index) =>
                        (
                            <option className='op' key={index} value={department.id}>{department.name}</option>
                        ))
                    }
                </select>
                {errors.department_id && touched.department_id && (<p className="error">{errors.department_id}</p>)}
            </div>
        </>
    )
}

export default DepartmentRow;