// تعديل بداية الملف لضمان التحميل الصحيح
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء هيكل التعليقات ديناميكياً
    const container = document.getElementById('comments-container');
    
    container.innerHTML = `
<div class="comments-container">
  <div class="comments-header">
    <div class="sort-order">
      <button class="btn btn-secondary" id="sortBtn">
        <i class="fas fa-sort-amount-down"></i>
        <span id="sortText">الأحدث أولاً</span>
      </button>
      <div class="average-rating">
        <span>التقييم العام:</span>
        <div class="average-rating-value" id="averageRating">0.0</div>
        <i class="fas fa-star"></i>
      </div>
    </div>
    <button class="btn btn-primary" id="sendCommentBtn">
      <i class="fas fa-comment-dots"></i>
      إرسال تعليق
    </button>
  </div>
  
  <div class="comments-list" id="commentsList">
    <div class="loading-container" id="loadingContainer">
      <div class="jumping-cat">🐈‍⬛</div>
      <div class="loading-text">جاري تحميل التعليقات...</div>
    </div>
  </div>
</div>

<!-- نافذة إرسال/تعديل تعليق -->
<div class="modal" id="commentModal">
  <div class="modal-content">
    <div class="modal-header" id="modalHeader">إرسال تعليق جديد</div>
    <div class="form-group">
      <label for="username">اسم المستخدم (١٥ حرف كحد أقصى)</label>
      <input type="text" id="username" maxlength="15">
      <div class="char-counter"><span id="usernameCounter">0</span>/15</div>
    </div>
    
    <div id="ratingContainer" style="display:none">
      <div style="color:white;margin-bottom:5px;font-size:14px">التقييم:</div>
      <div class="star-rating">
        <input type="radio" id="star5" name="rating" value="5">
        <label for="star5">★</label>
        <input type="radio" id="star4" name="rating" value="4">
        <label for="star4">★</label>
        <input type="radio" id="star3" name="rating" value="3">
        <label for="star3">★</label>
        <input type="radio" id="star2" name="rating" value="2">
        <label for="star2">★</label>
        <input type="radio" id="star1" name="rating" value="1">
        <label for="star1">★</label>
      </div>
    </div>
    
    <div class="form-group">
      <label for="comment">التعليق (١٠٠ حرف كحد أقصى)</label>
      <textarea id="comment" maxlength="100"></textarea>
      <div class="char-counter"><span id="commentCounter">0</span>/100</div>
    </div>
    
    <div class="form-group">
      <label for="password">كلمة السر (١٧ حرف كحد أقصى)</label>
      <input type="password" id="password" maxlength="17">
      <i class="fas fa-eye toggle-password" id="togglePassword"></i>
      <div class="char-counter"><span id="passwordCounter">0</span>/17</div>
    </div>
    
    <div class="modal-footer">
      <button class="btn btn-secondary" id="addRatingBtn" style="display:none">
        <i class="fas fa-star"></i>
        إضافة تقييم
      </button>
      <button class="btn btn-secondary" id="closeModalBtn">إغلاق</button>
      <div>
        <button class="btn btn-success" id="submitCommentBtn">نشر التعليق</button>
        <button class="btn btn-danger" id="deleteCommentBtn" style="display:none">حذف التعليق</button>
      </div>
    </div>
  </div>
</div>

<!-- نافذة كلمة السر -->
<div class="modal" id="passwordModal">
  <div class="modal-content">
    <div class="modal-header">أدخل كلمة السر</div>
    <div class="form-group">
      <label for="editPassword">كلمة السر</label>
      <input type="password" id="editPassword" maxlength="17">
      <i class="fas fa-eye toggle-password" id="toggleEditPassword"></i>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="closePasswordModalBtn">إغلاق</button>
      <button class="btn btn-success" id="verifyPasswordBtn">تحقق</button>
    </div>
  </div>
</div>
        `;
document.addEventListener('DOMContentLoaded', function() {
  // العناصر الأساسية
  const BIN_ID = '686249f38561e97a502ebca0';
  const API_KEY = '$2a$10$F5TR7pSKPRRNAeBzsdxQ4.NYog8xHGUi0hektkor0q/QWFVXzba3q';
  const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
  const COMMENTS_KEY = 'comments';
  
  // عناصر DOM
  const elements = {
    commentsList: document.getElementById('commentsList'),
    loadingContainer: document.getElementById('loadingContainer'),
    sendCommentBtn: document.getElementById('sendCommentBtn'),
    sortBtn: document.getElementById('sortBtn'),
    sortText: document.getElementById('sortText'),
    averageRating: document.getElementById('averageRating'),
    commentModal: document.getElementById('commentModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    submitCommentBtn: document.getElementById('submitCommentBtn'),
    deleteCommentBtn: document.getElementById('deleteCommentBtn'),
    addRatingBtn: document.getElementById('addRatingBtn'),
    modalHeader: document.getElementById('modalHeader'),
    usernameInput: document.getElementById('username'),
    commentInput: document.getElementById('comment'),
    passwordInput: document.getElementById('password'),
    togglePassword: document.getElementById('togglePassword'),
    toggleEditPassword: document.getElementById('toggleEditPassword'),
    passwordModal: document.getElementById('passwordModal'),
    editPasswordInput: document.getElementById('editPassword'),
    verifyPasswordBtn: document.getElementById('verifyPasswordBtn'),
    closePasswordModalBtn: document.getElementById('closePasswordModalBtn'),
    ratingContainer: document.getElementById('ratingContainer'),
    usernameCounter: document.getElementById('usernameCounter'),
    commentCounter: document.getElementById('commentCounter'),
    passwordCounter: document.getElementById('passwordCounter')
  };

  // متغيرات الحالة
  let currentEditId = null;
  let isNewestFirst = true;
  let showRating = false;

  // وظائف المساعدة
  function showError() {
    elements.loadingContainer.innerHTML = '<div class="error-container">خطأ في تحميل التعليقات</div>';
  }

  function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  function updateCharCounters() {
    elements.usernameCounter.textContent = elements.usernameInput.value.length;
    elements.commentCounter.textContent = elements.commentInput.value.length;
    elements.passwordCounter.textContent = elements.passwordInput.value.length;
    
    // تغيير لون العداد عند الوصول للحد
    elements.usernameCounter.classList.toggle('limit', elements.usernameInput.value.length >= 15);
    elements.commentCounter.classList.toggle('limit', elements.commentInput.value.length >= 100);
    elements.passwordCounter.classList.toggle('limit', elements.passwordInput.value.length >= 17);
  }

  function calculateAverageRating(comments) {
    const ratedComments = comments.filter(c => c.rating);
    if (ratedComments.length === 0) return 0;
    
    const sum = ratedComments.reduce((total, c) => total + parseInt(c.rating), 0);
    return (sum / ratedComments.length).toFixed(1);
  }

  // عرض التعليقات
  function renderComments(comments) {
    elements.commentsList.innerHTML = '';
    
    if (comments.length === 0) {
      elements.commentsList.innerHTML = '<div style="color:#bdc3c7;text-align:center;padding:20px">لا توجد تعليقات بعد</div>';
      return;
    }
    
    // ترتيب التعليقات
    const sortedComments = [...comments].sort((a, b) => {
      return isNewestFirst 
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
    
    // حساب التقييم المتوسط
    const avgRating = calculateAverageRating(comments);
    elements.averageRating.textContent = avgRating;
    
    sortedComments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-card';
      
      // إنشاء تقييم النجوم
      let ratingStars = '';
      if (comment.rating) {
        ratingStars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
      }
      
      commentElement.innerHTML = `
        <div class="comment-header">
          <div class="user-avatar"></div>
          <div class="user-info">
            <div class="username">${comment.username}</div>
            ${comment.rating ? `<div class="rating">${ratingStars}</div>` : ''}
          </div>
        </div>
        <div class="comment-body">${comment.comment}</div>
        <div class="comment-footer">
          <div>${formatDate(comment.date)}</div>
          <button class="edit-btn" data-id="${comment.id}">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      `;
      elements.commentsList.appendChild(commentElement);
    });
    
    // إضافة أحداث لأزرار التعديل
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentEditId = btn.getAttribute('data-id');
        elements.passwordModal.style.display = 'flex';
      });
    });
  }

  // وظائف API
  async function fetchComments() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      renderComments(data.record[COMMENTS_KEY] || []);
    } catch (error) {
      console.error('Error:', error);
      showError();
    }
  }

  async function saveComments(comments) {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({
          [COMMENTS_KEY]: comments
        })
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء حفظ التعليق');
    }
  }

  async function addComment(comment) {
    const currentComments = await getCurrentComments();
    currentComments.push(comment);
    await saveComments(currentComments);
    await fetchComments();
  }

  async function updateComment(id, updatedComment) {
    const currentComments = await getCurrentComments();
    const index = currentComments.findIndex(c => c.id === id);
    
    if (index !== -1) {
      currentComments[index] = {
        ...currentComments[index],
        ...updatedComment,
        date: new Date().toISOString()
      };
      
      await saveComments(currentComments);
      await fetchComments();
    }
  }

  async function deleteComment(id) {
    const currentComments = await getCurrentComments();
    const filteredComments = currentComments.filter(c => c.id !== id);
    await saveComments(filteredComments);
    await fetchComments();
  }

  async function getCurrentComments() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      return data.record[COMMENTS_KEY] || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // إعداد الأحداث
  elements.sendCommentBtn.addEventListener('click', () => {
    currentEditId = null;
    elements.usernameInput.value = '';
    elements.commentInput.value = '';
    elements.passwordInput.value = '';
    elements.modalHeader.textContent = 'إرسال تعليق جديد';
    elements.submitCommentBtn.textContent = 'نشر التعليق';
    elements.deleteCommentBtn.style.display = 'none';
    elements.addRatingBtn.style.display = 'inline-block';
    elements.ratingContainer.style.display = 'none';
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
      radio.checked = false;
    });
    elements.commentModal.style.display = 'flex';
  });

  elements.sortBtn.addEventListener('click', () => {
    isNewestFirst = !isNewestFirst;
    elements.sortText.textContent = isNewestFirst ? 'الأحدث أولاً' : 'الأقدم أولاً';
    fetchComments();
  });

  elements.closeModalBtn.addEventListener('click', () => {
    elements.commentModal.style.display = 'none';
  });

  elements.closePasswordModalBtn.addEventListener('click', () => {
    elements.passwordModal.style.display = 'none';
  });

  elements.addRatingBtn.addEventListener('click', () => {
    elements.ratingContainer.style.display = 'block';
    elements.addRatingBtn.style.display = 'none';
  });

  elements.togglePassword.addEventListener('click', function() {
    const type = elements.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    elements.passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });

  elements.toggleEditPassword.addEventListener('click', function() {
    const type = elements.editPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    elements.editPasswordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });

  // عدادات الأحرف
  elements.usernameInput.addEventListener('input', updateCharCounters);
  elements.commentInput.addEventListener('input', updateCharCounters);
  elements.passwordInput.addEventListener('input', updateCharCounters);

  elements.submitCommentBtn.addEventListener('click', async () => {
    const username = elements.usernameInput.value.trim();
    const comment = elements.commentInput.value.trim();
    const password = elements.passwordInput.value.trim();
    
    if (!username || !comment || !password) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? ratingInput.value : null;
    
    const newComment = {
      id: generateRandomId(),
      username,
      comment,
      password,
      rating,
      date: new Date().toISOString()
    };
    
    if (currentEditId) {
      await updateComment(currentEditId, { comment, rating });
      elements.commentModal.style.display = 'none';
    } else {
      await addComment(newComment);
      elements.commentModal.style.display = 'none';
    }
  });

  elements.deleteCommentBtn.addEventListener('click', async () => {
    if (!currentEditId) return;
    if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      await deleteComment(currentEditId);
      elements.commentModal.style.display = 'none';
    }
  });

  elements.verifyPasswordBtn.addEventListener('click', async () => {
    const password = elements.editPasswordInput.value.trim();
    
    if (!password) {
      alert('الرجاء إدخال كلمة السر');
      return;
    }
    
    const currentComments = await getCurrentComments();
    const comment = currentComments.find(c => c.id === currentEditId);
    
    if (!comment) {
      alert('التعليق غير موجود');
      return;
    }
    
    if (comment.password !== password) {
      alert('كلمة السر غير صحيحة');
      return;
    }
    
    elements.passwordModal.style.display = 'none';
    elements.editPasswordInput.value = '';
    
    const { username, comment: text, rating } = comment;
    elements.usernameInput.value = username;
    elements.commentInput.value = text;
    elements.passwordInput.value = '';
    
    if (rating) {
      document.getElementById(`star${rating}`).checked = true;
      elements.ratingContainer.style.display = 'block';
      elements.addRatingBtn.style.display = 'none';
    } else {
      elements.ratingContainer.style.display = 'none';
      elements.addRatingBtn.style.display = 'inline-block';
    }
    
    elements.modalHeader.textContent = 'تعديل التعليق';
    elements.submitCommentBtn.textContent = 'نشر التعديل';
    elements.deleteCommentBtn.style.display = 'inline-block';
    elements.commentModal.style.display = 'flex';
  });

  // بدء التطبيق
  updateCharCounters();
  fetchComments();
}});
