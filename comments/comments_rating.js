(function() {
  const containerSelector = '.average-rating';
  const displayEl = document.getElementById('ratings');
  if (!displayEl) return; 

  let lastText = null;
  function readAndUpdate(container) {
    if (!container) return false;

    const valueSpan = container.querySelector('.average-rating-value');
  
    const spans = Array.from(container.querySelectorAll('span'));
    const countSpan = spans.find(s => !s.classList.contains('average-rating-value')) || null;

    const rawValue = valueSpan ? valueSpan.textContent.trim() : '';
    const rawCount = countSpan ? countSpan.textContent.trim() : '';
    const valueMatch = rawValue.match(/[\d.,]+/);
    let value = valueMatch ? valueMatch[0].replace(',', '.') : (rawValue || '0.0');

    let count = '';
    const countMatch = rawCount.match(/[\d,]+/);
    if (countMatch) {
      count = countMatch[0].replace(',', '');
    }

    const displayText = count ? `[ التقييم: ${value} (${count}) ]` : `[ التقييم: ${value} ]`;

    if (displayText !== lastText) {
      displayEl.textContent = displayText;
      lastText = displayText;
    }
    return true;
  }
  
  let mo = null;
  function observeContainer(container) {
    if (!container) return;
    if (mo) mo.disconnect();
    mo = new MutationObserver(() => readAndUpdate(container));
    mo.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'data-value']
    });
  }

  let pollingInterval = null;
  function startPolling() {
    if (pollingInterval) return;
    pollingInterval = setInterval(() => {
      const container = document.querySelector(containerSelector);
      if (container) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        readAndUpdate(container);
        observeContainer(container);
      }
    }, 300);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector(containerSelector);
    if (container) {
      readAndUpdate(container);
      observeContainer(container);
    } else {
      startPolling();
    }
  });
  
  window.updateRatingsFromAverage = function() {
    const c = document.querySelector(containerSelector);
    if (c) readAndUpdate(c);
  };
})();