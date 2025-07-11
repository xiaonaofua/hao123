// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 添加點擊統計功能
    const navLinks = document.querySelectorAll('.nav-row a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 記錄點擊統計
            const siteName = this.textContent;
            console.log(`點擊了: ${siteName}`);
            trackClick(siteName);
        });
    });

    // 添加站內搜索功能
    addSiteSearchFunctionality();

    // 添加時間顯示
    updateTime();
    setInterval(updateTime, 1000);

    // 添加快捷鍵支持
    addKeyboardShortcuts();
});

// 點擊統計函數
function trackClick(siteName) {
    // 使用 localStorage 來簡單記錄點擊次數
    const clicks = JSON.parse(localStorage.getItem('siteClicks') || '{}');
    clicks[siteName] = (clicks[siteName] || 0) + 1;
    localStorage.setItem('siteClicks', JSON.stringify(clicks));
}

// 添加站內搜索功能
function addSiteSearchFunctionality() {
    const searchInput = document.getElementById('siteSearchInput');
    const clearButton = document.getElementById('clearSiteSearch');

    if (!searchInput || !clearButton) {
        console.log('站內搜索元素未找到');
        return;
    }

    // 搜索功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const navLinks = document.querySelectorAll('.nav-row a');
        const navRows = document.querySelectorAll('.nav-row');

        navLinks.forEach(link => {
            const siteName = link.textContent.toLowerCase();
            const siteUrl = link.href.toLowerCase();

            // 提取域名進行匹配
            let domain = '';
            try {
                const url = new URL(siteUrl);
                domain = url.hostname.replace('www.', ''); // 去掉 www 前綴
            } catch (e) {
                domain = siteUrl;
            }

            // 檢查是否匹配網站名稱或域名
            const nameMatch = siteName.includes(searchTerm);
            const domainMatch = domain.includes(searchTerm);
            const urlMatch = siteUrl.includes(searchTerm);

            const isVisible = nameMatch || domainMatch || urlMatch;
            link.style.display = isVisible ? 'inline-block' : 'none';
        });

        // 隱藏沒有可見連結的行
        navRows.forEach(row => {
            const visibleLinks = row.querySelectorAll('a[style*="inline-block"]');
            const allLinks = row.querySelectorAll('a');
            const hasVisibleLinks = Array.from(allLinks).some(link =>
                !link.style.display || link.style.display === 'inline-block'
            );

            row.style.display = hasVisibleLinks ? 'flex' : 'none';
        });
    });

    // 清除搜索
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });
}

// 更新時間顯示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
}

// 添加鍵盤快捷鍵
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + / 或 Cmd + / 聚焦站內搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            const searchInput = document.getElementById('siteSearchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // ESC 清除搜索
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('siteSearchInput');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        }
    });
}


