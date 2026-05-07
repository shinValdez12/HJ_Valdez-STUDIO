interface TaskProps {
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
    onDelete: (id: number) => void;
}

export default function TaskCard({ id, title, priority, onDelete}: TaskProps) {
    const colorMap = {
        high: "bg-red-100 text-red-700 border-red-200",
        medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
        low: "bg-green-100 text-green-700 border-green-200"
    };

    return (
        <div className="p-4 border rounded-xl shadow-sm bg-white flex justify-between items-center mb-3">
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${colorMap[priority]}`}>
            {priority.toUpperCase()}
            </span>
        </div>
        
        <button 
            onClick={() => onDelete(id)}
            className="text-gray-400 hover:text-red-500 transition-colors">
            Delete
        </button>
        </div>
    );
}