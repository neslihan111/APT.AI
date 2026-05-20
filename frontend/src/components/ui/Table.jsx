import './ui.css';

export const Table = ({ columns, data }) => {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((col, i) => <th key={i}>{col.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col, j) => <td key={j}>{col.render ? col.render(row) : row[col.accessor]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
