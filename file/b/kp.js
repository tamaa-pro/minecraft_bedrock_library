// كود لحفظ رابط الملف في الجلسة وإزالته من عنوان الصفحة
(function() {
    'use strict';
    
    // التحقق من وجود رابط ملف في عنوان الصفحة
    const currentUrl = new URL(window.location.href);
    const fileUrl = currentUrl.searchParams.get('url') || 
                    currentUrl.search.substring(1); // للحصول على المعامل بعد ?
    
    // إذا كان هناك رابط ملف صالح
    if (fileUrl && fileUrl.startsWith('http')) {
        // حفظ رابط الملف في sessionStorage
        sessionStorage.setItem('fileDownloadUrl', fileUrl);
        
        // إزالة رابط الملف من عنوان الصفحة
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        console.log('تم حفظ رابط الملف في الجلسة وإزالته من العنوان');
    }
    
    // دالة لاسترجاع رابط الملف من الجلسة
    function getFileUrlFromSession() {
        return sessionStorage.getItem('fileDownloadUrl');
    }
    
    // دالة لمسح رابط الملف من الجلسة (اختياري)
    function clearFileUrlFromSession() {
        sessionStorage.removeItem('fileDownloadUrl');
    }
    
    // جعل الدوال متاحة عالمياً إذا لزم الأمر
    window.getFileUrlFromSession = getFileUrlFromSession;
    window.clearFileUrlFromSession = clearFileUrlFromSession;
})();
