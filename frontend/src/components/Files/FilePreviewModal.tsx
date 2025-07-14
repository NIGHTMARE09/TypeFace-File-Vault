import React, { useEffect, useState } from 'react';
import { downloadFile } from '../../api';

interface FilePreviewModalProps {
  fileId: string | null;
  fileName: string | null;
  fileMimeType: string | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ fileId, fileName, fileMimeType, onClose }) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!fileId || !fileMimeType) {
        setFileContent(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setFileContent(null);

      try {
        const response = await downloadFile(fileId);
        const blob = response.data;

        if (fileMimeType.startsWith('text/') || fileMimeType === 'application/json') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFileContent(e.target?.result as string);
            setLoading(false);
          };
          reader.onerror = () => {
            setError('Failed to read text file.');
            setLoading(false);
          };
          reader.readAsText(blob);
        } else if (fileMimeType.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(blob);
          setFileContent(imageUrl);
          setLoading(false);
        } else {
          setError(`Preview not available for file type: ${fileMimeType}`);
          setLoading(false);
        }

      } catch (err) {
        console.error('Error fetching file content for preview:', err);
        setError('Failed to load file content for preview.');
        setLoading(false);
      }
    };

    fetchFileContent();

    return () => {
      if (fileContent && fileMimeType?.startsWith('image/')) {
        URL.revokeObjectURL(fileContent);
      }
    };
  }, [fileId, fileMimeType]);

  if (!fileId) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">Preview: {fileName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-semibold leading-none focus:outline-none">
            &times;
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto">
          {loading && <div className="text-gray-600 text-center py-8">Loading preview...</div>}
          {error && <div className="text-red-600 text-center py-8">Error: {error}</div>}
          {fileContent && (fileMimeType?.startsWith('text/') || fileMimeType === 'application/json') && (
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{fileContent}</pre>
          )}
          {fileContent && fileMimeType?.startsWith('image/') && (
            <img src={fileContent} alt={`Preview of ${fileName}`} className="max-w-full h-auto mx-auto" />
          )}
           {!loading && !error && !fileContent && (fileMimeType?.startsWith('text/') || fileMimeType?.startsWith('image/') || fileMimeType === 'application/json') && (
             <div className="text-gray-600 text-center py-8">No content to display for preview.</div>
           )}
             {!loading && !error && !fileContent && !(fileMimeType?.startsWith('text/') || fileMimeType?.startsWith('image/') || fileMimeType === 'application/json') && (
             <div className="text-gray-600 text-center py-8">Preview not available for this file type.</div>
           )}
        </div>
        <div className="flex justify-end items-center p-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
