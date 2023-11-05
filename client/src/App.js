import React, { useEffect, useState } from 'react';
import axios from 'axios'

function App() {
  const [customExtensions, setCustomExtensions] = useState([]);
  const [newExtension, setNewExtension] = useState('');
  const [fixedExtensions, setFixedExtensions] = useState([]);

  useEffect(() => {
    fetchFixedExtensions();
    fetchCustonExtensions();
  }, []);

  // 고정확장자 
  const fetchFixedExtensions = async () => {
    try {
      const response = await axios.get('/api/fixed/list');
      setFixedExtensions(response.data);
    } catch (error) {
      console.log('Axios Error : ', error);
    }
  }

  // 커스텀확장자
  const fetchCustonExtensions = async () => {
    try {
      const response = await axios.get('/api/custom/list');
      setCustomExtensions(response.data);
    } catch (error) {
      console.log('Axios Error : ', error);
    }
  }

  // 고정확장자 체크박스
  const handleFixedExtension = async (id, status) => {
    try {
      const updatedExtensions = fixedExtensions.map((extension) => extension.id === id ? { ...extension, status: status === 0 ? 1 : 0 } : extension);
      setFixedExtensions(updatedExtensions)

      const response = await axios.post(`/api/update/fixed`, { id, status })
      console.log(response)
    } catch (error) {
      console.log('Axios Error : ', error);
    }
  }

  // 커스텀확장자 추가
  const handleAddCustomExtension = async () => {
    try {
      // 유효성 체크
      if (!newExtension || newExtension.trim() === '') {
        alert('확장자를 입력해주세요.')
      }
      // 중복제거
      else if (customExtensions.some((extension) => extension.name === newExtension)) {
        alert('이미 존재하는 확장자입니다.');
      }
      // 고정확장자 이미 있는데 커스텀으로 추가할 시
      else if (fixedExtensions.some((extension) => extension.name === newExtension)) {
        alert('고정확장자는 커스텀으로 추가할 수 없습니다.')
      } else {
        //db 추가 요청
        const response = await axios.post(`/api/update/custom`, { name: newExtension })
        //custom/new 확장자 갱신
        const newExtensionObj = { id: response.data, name: newExtension }
        if (newExtension && newExtension.length <= 20) {
          setCustomExtensions([...customExtensions, newExtensionObj])
          setNewExtension('');
        }
      }
    } catch (error) {
      console.log('Axios Error : ', error);
    }
  }

  //커스텀 확장자 삭제
  const handleDeleteCustomExtension = async (id) => {
    try {
      //삭제 요청
      const response = await axios.post(`/api/delete/custom`, { id });
      console.log(response)

      //custom확장자 갱신
      if (response.status === 200) {
        const updatedCustomExtensions = customExtensions.filter((extension) => extension.id !== id);
        setCustomExtensions(updatedCustomExtensions);
      }
    } catch (error) {
      console.log('Axios Error : ', error);
    }
  }


  return (
    <div>
      <h2>1. 고정확장자</h2>
      <div style={{ margin: '10px' }}>
        <div>
          {fixedExtensions.map((extension) => (
            <label key={extension.id} style={{ margin: '0 10px 0 0' }}>
              <input
                type="checkbox"
                name="extension"
                value={extension.name}
                checked={extension.status === 1}
                onChange={() => handleFixedExtension(extension.id, extension.status)}
              />{' '}
              {extension.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2>2. 커스텀확장자</h2>
        <input
          style={{ margin: '10px' }}
          type="text"
          value={newExtension}
          onChange={(e) => setNewExtension(e.target.value)}
          maxLength={20}
        />
        <button style={{ background: 'grey', color: 'white' }} onClick={handleAddCustomExtension}>
          + 추가
        </button>
      </div>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          width: '500px',
          height: '300px',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', height: '30px', alignItems: 'center' }}>
          <p style={{ fontSize: '13px' }}>{customExtensions.length}/200</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {customExtensions.map((extension, idx) => (
            <div key={idx} style={{ margin: '5px' }}>
              <button onClick={() => handleDeleteCustomExtension(extension.id)}>
                {extension.name} X
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
