import './ui.css';

export const Input = ({ label, type = 'text', value, onChange, placeholder, className = '', ...rest }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label>{label}</label>}
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" {...rest} />
        </div>
    );
};
