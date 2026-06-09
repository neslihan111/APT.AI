import './ui.css';

export const Card = ({ children, className = '', title, onClick, tabIndex, role, onKeyDown, style }) => {
    return (
        <div 
            className={`card ${className}`} 
            onClick={onClick}
            tabIndex={tabIndex}
            role={role}
            onKeyDown={onKeyDown}
            style={style}
        >
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};
