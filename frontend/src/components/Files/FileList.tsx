import React, { useEffect, useState } from 'react';
import { getFiles, downloadFile, deleteFile } from '../../api';
import FilePreviewModal from './FilePreviewModal';

interface File {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

interface FileListProps {
  refetchTrigger: number;
}

const FileList: React.FC<FileListProps> = ({ refetchTrigger }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<File | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFiles();
      setFiles(response.data);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refetchTrigger]);

  const handlePreview = (file: File) => {
    setSelectedFileForPreview(file);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedFileForPreview(null);
  };

  const handleDownload = async (file: File) => {
    try {
      const response = await downloadFile(file.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const handleDelete = async (file: File) => {
    if (window.confirm(`Are you sure you want to delete ${file.originalName}?`)) {
      try {
        await deleteFile(file.id);
        setFiles(files.filter(f => f.id !== file.id));
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Files</h2>
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {loading && <p className="text-gray-600 text-sm text-center">Loading files...</p>}
      {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
      {!loading && !error && filteredFiles.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No files uploaded yet or matching your search.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filteredFiles.map((file) => (
            <li key={file.id} className="flex items-center justify-between py-3">
              <span className="text-gray-700 font-medium truncate max-w-xs">{file.originalName}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePreview(file)}
                  className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <FilePreviewModal
        fileId={selectedFileForPreview?.id || null}
        fileName={selectedFileForPreview?.originalName || null}
        fileMimeType={selectedFileForPreview?.mimetype || null}
        onClose={handleClosePreviewModal}
      />
    </div>
  );
};

export default FileList;
