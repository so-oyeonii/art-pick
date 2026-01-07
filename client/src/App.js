import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import FileGallery from './components/FileGallery';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/files');
      setFiles(response.data.files);
      setError(null);
    } catch (err) {
      setError('파일 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadSuccess = () => {
    fetchFiles();
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`/api/files/${filename}`);
      fetchFiles();
    } catch (err) {
      setError('파일 삭제에 실패했습니다.');
      console.error('Error deleting file:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎨 Art Pick</h1>
        <p>아트 파일 업로드 및 관리</p>
      </header>

      <main className="App-main">
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">파일을 불러오는 중...</div>
        ) : (
          <FileGallery files={files} onDelete={handleDelete} />
        )}
      </main>

      <footer className="App-footer">
        <p>© 2024 Art Pick. 파일 업로드 시스템</p>
      </footer>
    </div>
  );
}

export default App;
