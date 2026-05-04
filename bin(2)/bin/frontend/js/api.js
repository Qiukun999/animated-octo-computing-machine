// 自动检测API地址，支持localhost和局域网访问
const API_BASE_URL = `${window.location.protocol}//${window.location.host}/api`;

// 通用API请求函数
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_BASE_URL + url, options);
        return await response.json();
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 课程API
const courseAPI = {
    getAll: () => apiRequest('/courses'),
    get: (id) => apiRequest(`/courses/${id}`),
    create: (data) => apiRequest('/courses', 'POST', data),
    update: (id, data) => apiRequest(`/courses/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/courses/${id}`, 'DELETE')
};

// 成绩API
const gradeAPI = {
    getAll: () => apiRequest('/grades'),
    get: (id) => apiRequest(`/grades/${id}`),
    create: (data) => apiRequest('/grades', 'POST', data),
    update: (id, data) => apiRequest(`/grades/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/grades/${id}`, 'DELETE'),
    getGPA: () => apiRequest('/grades/gpa')
};

// 经历API
const experienceAPI = {
    getAll: () => apiRequest('/experiences'),
    get: (id) => apiRequest(`/experiences/${id}`),
    create: (data) => apiRequest('/experiences', 'POST', data),
    update: (id, data) => apiRequest(`/experiences/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/experiences/${id}`, 'DELETE')
};

// 奖项API
const achievementAPI = {
    getAll: () => apiRequest('/achievements'),
    get: (id) => apiRequest(`/achievements/${id}`),
    create: (data) => apiRequest('/achievements', 'POST', data),
    update: (id, data) => apiRequest(`/achievements/${id}`, 'PUT', data),
    delete: (id) => apiRequest(`/achievements/${id}`, 'DELETE')
};

// 报告API
const reportAPI = {
    get: () => apiRequest('/report')
};

// 工具函数
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.container').firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}
