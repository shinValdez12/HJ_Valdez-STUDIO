"use client"

import { FormEvent, use, useEffect, useState } from "react"

import TaskItem from "./TaskItem";

export default function TaskManager() {
    interface Task {
        id: number;
        title: string;
        created_at: string;
        is_completed: boolean;
    }
    
    const [ editingId, setEditingId ] = useState<number | null>(null);
    const [ editedTitle, setEditedTitle ] = useState("");

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask, ] = useState("");

    useEffect(() => {
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error fetching tasks:", err));
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault();
        if (newTask.trim() === "") return;
        
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task: newTask }),
        });

        if (response.ok) {
            const res = await response.json();
            const addedTask = res[0];
            setTasks((prevTasks) => [...prevTasks, addedTask]);
            setNewTask("");
        }

    };

    const handleDeleteTask = async (id: number) => {
        const response = await fetch("/api/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (response.ok) {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        }
    };

    const handleTaggleTask = async (id: number, is_currentStatus: boolean) => {
        const response = await fetch("/api/tasks", {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, is_completed: !is_currentStatus }),
        });

        if (response.ok) {
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, is_completed: !is_currentStatus } : t))
            );
        }
    };

    const handleEditTask = async (id: number, newTitle: string) => {
        const response = await fetch("/api/tasks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, title: newTitle }),
        });

        if (response.ok) {
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Task Manager
                </h2>
                
                <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
                    <input 
                        type="text" 
                        placeholder="What needs to be done?"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Add
                    </button>
                </form>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Task List ({tasks.length})
                    </h3>
                    <ul className="divide-y divide-gray-100">
                        {tasks.map((task, index) => (
                            <TaskItem 
                            key={task.id}
                            is_completed={task.is_completed}
                            onToggle={handleTaggleTask}
                            id={task.id}
                            title={task.title}
                            onDelete={handleDeleteTask}
                            onUpdate={handleEditTask}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}