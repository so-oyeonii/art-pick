import React from 'react';
import './FileGallery.css';

function FileGallery({ files, onDelete }) {
  if (!files || files.length === 0) {
    return (
      <div className="gallery-container">
        <div className="empty-gallery">
          <p>업로드된 파일이 없습니다.</p>
          <p className="empty-hint">위에서 파일을 업로드해보세요! 🎨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <h2>업로드된 파일 ({files.length})</h2>
      <div className="gallery-grid">
        {files.map((file, index) => (
          <div key={index} className="gallery-item">
            <div className="image-container">
              <img 
                src={file.path} 
                alt={file.filename}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>
            <div className="file-info">
              <p className="filename" title={file.filename}>
                {file.filename}
              </p>
              <button 
                className="delete-button"
                onClick={() => {
                  if (window.confirm('이 파일을 삭제하시겠습니까?')) {
                    onDelete(file.filename);
                  }
                }}
              >
                🗑️ 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileGallery;
