// التحقق من المفتاح وإدارة الروابط
(function() {
    'use strict';
    
    // المفتاح الثابت المطلوب
    const REQUIRED_KEY = '0';
    
    // وظيفة التحقق من المفتاح وإدارة الروابط
    function validateAndProcessURL() {
        const currentURL = window.location.href;
        const urlObj = new URL(currentURL);
        const searchParams = new URLSearchParams(urlObj.search);
        
        // استخراج جميع المعلمات من URL
        const params = [];
        for (const [key, value] of searchParams) {
            params.push(value);
        }
        
        // إذا لم توجد معلمات كافية، توجيه إلى about:blank
        if (params.length < 2) {
            window.location.replace('about:blank');
            return;
        }
        
        // المعلمة الأولى هي رابط الملف
        const fileURL = params[0];
        
        // المعلمة الثانية هي المفتاح
        const providedKey = params[1];
        
        // التحقق من المفتاح
        if (providedKey !== REQUIRED_KEY) {
            window.location.replace('about:blank');
            return;
        }
        
        // حفظ البيانات في sessionStorage
        sessionStorage.setItem('fileURL', fileURL);
        sessionStorage.setItem('accessKey', providedKey);
        
        // تحديث الـ URL بدون عرض المفتاح ورابط الملف
        const cleanURL = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanURL);
    }
    
    // تنفيذ التحقق فور تحميل الصفحة
    validateAndProcessURL();
    
    // وظيفة لاسترجاع رابط الملف من sessionStorage
    window.getFileURL = function() {
        return sessionStorage.getItem('fileURL');
    };
    
    // وظيفة للتحقق من وجود المفتاح في الجلسة
    window.hasValidKey = function() {
        return sessionStorage.getItem('accessKey') === REQUIRED_KEY;
    };
})();
