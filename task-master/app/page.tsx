// src/app/page.tsx
"use client";
import { useState } from "react";
import TaskCard from "@/src/components/TaskCard";
import { createClient } from "@/src/utils/supabase/client";
import { title } from "process";

interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");

  const addTask = () => {
    if (text.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      title: text,
      priority: "medium",
    };
    const supabase = createClient()

    const { error } = await supabase
      .from('tasks')
      .insert({ title: text, priority: 'medium'})
    setText("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">TaskMaster</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 border rounded-lg text-black"
        />
        <button 
          onClick={addTask}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white font-bold"
        >
          Add
        </button>
      </div>

      <div>
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            id={task.id} 
            title={task.title} 
            priority={task.priority} 
            onDelete={deleteTask} 
          />
        ))}
      </div>
    </main>
  );
}