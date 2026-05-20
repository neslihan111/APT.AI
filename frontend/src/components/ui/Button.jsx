import './ui.css';

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
    return (
        <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};
