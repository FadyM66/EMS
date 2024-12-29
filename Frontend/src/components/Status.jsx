
const Status = ({ key, value, onChange, errors, touched }) => {
    return (
        <>
            <div className='row' key={key}>
                <label>Status</label>
                <select id="status" value={value} onChange={onChange} name="status"
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
        </>
    )
}

export default Status;