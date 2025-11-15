// التحقق من المفتاح وإدارة الروابط - الإصدار المعدل
(function() {
    'use strict';
    
    // المفتاح الثابت المطلوب
    const REQUIRED_KEY = 'cyn';
    
    // وظيفة التحقق من المفتاح وإدارة الروابط
    function validateAndProcessURL() {
        // الحصول على الرابط الحالي
        const currentURL = window.location.href;
        
        // البحث عن موقع "/?" في الرابط
        const keySeparatorIndex = currentURL.indexOf('/?');
        
        // إذا لم يتم العثور على المفتاح، توجيه إلى about:blank
        if (keySeparatorIndex === -1) {
            window.location.replace('about:blank');
            return;
        }
        
        // استخراج رابط الملف (كل ما بعد ? وقبل /?)
        const fileURLStart = currentURL.indexOf('?') + 1;
        const fileURLEnd = keySeparatorIndex;
        const fileURL = currentURL.substring(fileURLStart, fileURLEnd);
        
        // استخراج المفتاح (كل ما بعد /?)
        const providedKey = currentURL.substring(keySeparatorIndex + 2);
        
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
