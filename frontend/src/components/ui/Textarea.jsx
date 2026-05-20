import './ui.css';

export const Textarea = ({ label, value, onChange, placeholder, rows = 4, className = '' }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label>{label}</label>}
            <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="input-field" />
        </div>
    );
};
