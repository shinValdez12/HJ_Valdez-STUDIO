"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockDataStore } from "@/mock/store";

export default function EmployeeDocumentsPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      const docs = mockDataStore.documents.filter((d) => d.employeeId === user.id);
      setFiles(docs);
    }
  }, [user]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedFile) return;

    // create object URL for preview and store in mock
    const url = URL.createObjectURL(selectedFile);
    const doc = mockDataStore.uploadDocument(user.id, selectedFile.name, selectedFile.type, url);
    setFiles((f) => [doc, ...f]);
    setSelectedFile(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Document Vault</h1>

      <form onSubmit={handleUpload} className="mb-4">
        <input type="file" onChange={(ev) => setSelectedFile(ev.target.files ? ev.target.files[0] : null)} />
        <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
      </form>

      <div className="space-y-3">
        {files.length === 0 ? (
          <p>No documents uploaded.</p>
        ) : (
          files.map((d) => (
            <div key={d.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{d.fileName}</div>
                <div className="text-sm text-muted-foreground">{d.documentType} • {new Date(d.uploadedAt).toLocaleString()}</div>
              </div>
              <div>
                {d.url ? (
                  <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={() => window.open(d.url, "_blank")}>Preview</button>
                ) : (
                  <span className="text-sm text-muted-foreground">No preview</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
