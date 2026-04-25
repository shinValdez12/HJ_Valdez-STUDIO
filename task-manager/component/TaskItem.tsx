import { useState } from 'react';

interface TaskItemProps {
    id: number;
    title: string;
    is_completed: boolean;
    onUpdate: (id: number, newTitle: string) => void;
    onToggle: (id: number, status: boolean) => void;
    onDelete: (id: number) => void;
}

export default function TaskItem({ id, title, is_completed, onToggle, onDelete, onUpdate }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(title);

    const handleSave = () => {
        if (tempText.trim() !== "" && tempText !== title) {
            onUpdate(id, tempText);
        } else {
            setTempText(title);
        }
        setIsEditing(false);
    };

    return (
        <li className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border mb-2">
            <div className="flex items-center gap-3 flex-1">
                {isEditing ? (
                    <input 
                        className="border rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        onBlur={handleSave} // Calls our unified save function
                        onKeyDown={(e) => e.key === "Enter" && handleSave()} // User can hit Enter!
                        autoFocus
                    />
                ) : (
                    <>
                        <input 
                            type="checkbox" 
                            checked={is_completed} 
                            onChange={() => onToggle(id, is_completed)} 
                            className="w-4 h-4"
                        />
                        <span className={is_completed ? "line-through text-gray-400" : "text-gray-700"}>
                            {title}
                        </span>
                    </>
                )}
            </div>
            
            <div className="flex gap-3 ml-4">
                {!is_completed && (
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                        className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                    >
                        {isEditing ? "Save" : "Edit"}
                    </button>
                )}
                <button 
                    onClick={() => onDelete(id)} 
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                    Delete
                </button>
            </div>
        </li>
    );
}