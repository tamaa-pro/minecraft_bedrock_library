document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .comment-content {
      position: relative;
      margin-bottom: 10px;
    }
    .comment-media {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .comment-media-item {
      border-radius: 8px;
      background-color: #1a202c;
      object-fit: contain;
    }
    .media-style-1 { width: 100%; max-height: 300px; }
    .media-style-2 { width: 50%; max-height: 200px; align-self: flex-end; }
    .media-style-3 { width: 50%; max-height: 200px; align-self: center; }
    .media-style-4 { width: 50%; max-height: 200px; align-self: flex-start; }
    .media-style-5 { width: 30%; max-height: 150px; align-self: flex-end; }
    .media-style-6 { width: 30%; max-height: 150px; align-self: center; }
    .media-style-7 { width: 30%; max-height: 150px; align-self: flex-start; }
    .media-style-8 { width: calc(100% - 10px); max-height: 300px; border: 2px solid #4299e1; padding: 3px; margin: 0 5px; }
    .comment-links {
      display: flex;
      gap: 10px;
      margin: 15px 0;
      flex-wrap: wrap;
    }
    .comment-link-btn {
      background-color: #4299e1;
      color: white;
      text-decoration: none;
      padding: 8px 15px;
      border-radius: 5px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;
      text-align: center;
      min-height: 36px;
      box-sizing: border-box;
    }
    .comment-link-btn:hover {
      background-color: #3182ce;
    }
    .links-style-1 { justify-content: flex-end; }
    .links-style-2 { justify-content: center; }
    .links-style-3 { justify-content: flex-start; }
    .links-style-4 { flex-direction: column; align-items: stretch; }
    .links-style-4 .comment-link-btn { width: 100%; }
    .links-style-5 { 
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .links-style-5 .comment-link-btn { width: 100%; }
    .links-style-6 { 
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .links-style-6 .comment-link-btn { width: 100%; }
    .links-style-7 { 
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
    }
    .links-style-7 .comment-link-btn { 
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .links-style-8 .comment-link-btn {
      background: none;
      color: #63b3ed;
      padding: 0;
      text-decoration: underline;
    }
    .links-style-8 .comment-link-btn:hover {
      background: none;
      color: #4299e1;
    }
    .comment-media audio,
    .comment-media video {
      width: 100%;
      margin-top: 5px;
    }
  `;
  document.head.appendChild(style);

  function extractMediaAndLinks(text) {
    if (!text) return { text: text, media: [], links: [] };
    
    const media = [];
    const links = [];
    
    const mediaRegex = /\[(https?:\/\/[^\]]+\.(png|jpg|jpeg|gif|mp4|m4a|ogg|mp3|wav))\]/gi;
    let processedText = text.replace(mediaRegex, (match, url, ext) => {
      const type = ext.match(/(mp4|m4a)/) ? 'video' : 
                  ext.match(/(ogg|mp3|wav)/) ? 'audio' : 'image';
      media.push({ 
        url: url, 
        type: type, 
        style: 1 
      });
      return '';
    });
    
    const mediaWithStyleRegex = /\[(https?:\/\/[^\]]+\.(png|jpg|jpeg|gif))\s*,\s*(\d)\]/gi;
    processedText = processedText.replace(mediaWithStyleRegex, (match, url, ext, styleNum) => {
      media.push({ 
        url: url, 
        type: 'image', 
        style: parseInt(styleNum) || 1 
      });
      return '';
    });
    
    const buttonRegex = /\['([^']+)':\s*'([^']+)'\s*,\s*(\d)\]/gi;
    processedText = processedText.replace(buttonRegex, (match, btnText, btnUrl, styleNum) => {
      links.push({ 
        text: btnText.trim(), 
        url: btnUrl.trim(), 
        style: parseInt(styleNum) || 6 
      });
      return '';
    });
    
    const buttonDefaultRegex = /\['([^']+)':\s*'([^']+)'\s*\]/gi;
    processedText = processedText.replace(buttonDefaultRegex, (match, btnText, btnUrl) => {
      links.push({ 
        text: btnText.trim(), 
        url: btnUrl.trim(), 
        style: 6 
      });
      return '';
    });
    
    processedText = processedText.trim()
      .replace(/\s+/g, ' ')
      .replace(/\[\s*\]|''|\[\s*,\s*\d\]/g, '');
    
    return { text: processedText, media: media, links: links };
  }

  function createMediaElement(media) {
    if (media.type === 'image') {
      const img = document.createElement('img');
      img.src = media.url;
      img.className = `comment-media-item media-style-${media.style}`;
      img.alt = 'صورة مرفقة';
      img.loading = 'lazy';
      img.onerror = function() {
        this.style.display = 'none';
      };
      return img;
    } else if (media.type === 'video') {
      const video = document.createElement('video');
      video.src = media.url;
      video.className = 'comment-media-item media-style-1';
      video.controls = true;
      return video;
    } else if (media.type === 'audio') {
      const audio = document.createElement('audio');
      audio.src = media.url;
      audio.className = 'comment-media-item';
      audio.controls = true;
      return audio;
    }
  }

  function processCommentElement(commentElement) {
    const textElement = commentElement.querySelector('.comment-text');
    if (!textElement) return;
    
    const originalText = textElement.textContent || textElement.innerText;
    const processed = extractMediaAndLinks(originalText);
    
    textElement.textContent = processed.text;
    
    let contentElement = commentElement.querySelector('.comment-content');
    if (!contentElement) {
      contentElement = document.createElement('div');
      contentElement.className = 'comment-content';
      textElement.parentNode.insertBefore(contentElement, textElement);
      contentElement.appendChild(textElement);
    }
    
    const existingMedia = contentElement.querySelector('.comment-media');
    if (existingMedia) {
      existingMedia.remove();
    }
    
    if (processed.media.length > 0) {
      const mediaContainer = document.createElement('div');
      mediaContainer.className = 'comment-media';
      
      processed.media.forEach(media => {
        const mediaElement = createMediaElement(media);
        if (mediaElement) {
          mediaContainer.appendChild(mediaElement);
        }
      });
      
      contentElement.appendChild(mediaContainer);
    }
    
    const existingLinks = contentElement.querySelector('.comment-links');
    if (existingLinks) {
      existingLinks.remove();
    }
    
    if (processed.links.length > 0) {
      const linksContainer = document.createElement('div');
      linksContainer.className = `comment-links links-style-${processed.links[0].style}`;
      
      processed.links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'comment-link-btn';
        linkElement.textContent = link.text;
        linksContainer.appendChild(linkElement);
      });
      
      contentElement.appendChild(linksContainer);
    }
  }

  function processAllComments() {
    const comments = document.querySelectorAll('.comment-card, .reply-card');
    comments.forEach(comment => {
      processCommentElement(comment);
    });
  }

  const observer = new MutationObserver(function(mutations) {
    let shouldProcess = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList && (node.classList.contains('comment-card') || node.classList.contains('reply-card'))) {
              shouldProcess = true;
            } else if (node.querySelectorAll('.comment-card, .reply-card').length > 0) {
              shouldProcess = true;
            }
          }
        });
      }
    });
    
    if (shouldProcess) {
      setTimeout(processAllComments, 50);
    }
  });

  setTimeout(() => {
    processAllComments();
    observer.observe(document.body, { childList: true, subtree: true });
  }, 500);
});

(function() {
  const originalShowAddCommentModal = window.showAddCommentModal;
  const originalShowEditCommentModal = window.showEditCommentModal;
  const originalShowReplyModal = window.showReplyModal;
  
  function countTextWithoutMedia(text) {
    if (!text) return 0;
    
    let cleanText = text.replace(/\[(https?:\/\/[^\]]+\.(png|jpg|jpeg|gif|mp4|m4a|ogg|mp3|wav))\]/gi, '');
    cleanText = cleanText.replace(/\[(https?:\/\/[^\]]+\.(png|jpg|jpeg|gif))\s*,\s*\d\]/gi, '');
    cleanText = cleanText.replace(/\['([^']+)':\s*'([^']+)'\s*,\s*\d\]/gi, '');
    cleanText = cleanText.replace(/\['([^']+)':\s*'([^']+)'\s*\]/gi, '');
    
    return cleanText.length;
  }
  
  function setupTextCounter(textarea, counter) {
    if (!textarea || !counter) return;
    
    const updateCounter = () => {
      const length = countTextWithoutMedia(textarea.value);
      counter.textContent = length;
      
      if (length > 200) {
        const cleanValue = textarea.value.substring(0, 200 + (textarea.value.length - length));
        textarea.value = cleanValue;
        counter.textContent = 200;
      }
    };
    
    updateCounter();
    
    textarea.addEventListener('input', updateCounter);
  }
  
  if (originalShowAddCommentModal) {
    window.showAddCommentModal = function() {
      originalShowAddCommentModal();
      
      setTimeout(() => {
        const textarea = document.getElementById('comment-text');
        const counter = document.getElementById('text-counter');
        setupTextCounter(textarea, counter);
      }, 100);
    };
  }
  
  if (originalShowEditCommentModal) {
    window.showEditCommentModal = function(comment) {
      originalShowEditCommentModal(comment);
      
      setTimeout(() => {
        const textarea = document.getElementById('edit-text');
        const counter = document.getElementById('edit-text-counter');
        setupTextCounter(textarea, counter);
      }, 100);
    };
  }
  
  if (originalShowReplyModal) {
    window.showReplyModal = function() {
      originalShowReplyModal();
      
      setTimeout(() => {
        const textarea = document.getElementById('reply-text');
        const counter = document.getElementById('reply-text-counter');
        setupTextCounter(textarea, counter);
      }, 100);
    };
  }
  
  const originalSubmitComment = window.submitComment;
  if (originalSubmitComment) {
    window.submitComment = function() {
      const textarea = document.getElementById('comment-text') || document.getElementById('edit-text');
      if (textarea) {
        const length = countTextWithoutMedia(textarea.value);
        if (length > 200) {
          alert('النص يتجاوز الحد المسموح به (200 حرف)');
          return;
        }
      }
      originalSubmitComment();
    };
  }
})();