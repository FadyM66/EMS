
const InputRow = ({ values, handleChange, handleBlur, errors, touched, htmlFor, label, inputId, name, type, placeholder }) => {
    return (
        <>
            <div className="row">
                <label htmlFor={htmlFor}>{label}</label>
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    className={errors[name] && touched[name] ? "error" : ""}
                    placeholder={placeholder}
                    value={values[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors[name] && touched[name] && <p className="error">{errors[name]}</p>}
            </div>
        </>
    )
}

export default InputRow;