const FormInput = (props) => {
    const { label, placeholder, type, onChange, name } = props

    return (
        <div>
            <label>{label}</label>
            <input
                placeholder={placeholder}
                type={type}
                name={name}
                onChange={onChange}
            />
        </div>
    )
}

export default FormInput;