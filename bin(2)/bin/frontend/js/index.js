// 首页统计数据加载
async function loadDashboardStats() {
    try {
        // 获取课程数量
        const coursesData = await courseAPI.getAll();
        const totalCourses = coursesData.data ? coursesData.data.length : 0;
        document.getElementById('totalCourses').textContent = totalCourses;

        // 获取GPA
        const gpaData = await gradeAPI.getGPA();
        const gpa = gpaData.gpa ? gpaData.gpa.toFixed(2) : '0.00';
        document.getElementById('currentGPA').textContent = gpa;

        // 获取经历数量
        const experiencesData = await experienceAPI.getAll();
        const totalExperiences = experiencesData.data ? experiencesData.data.length : 0;
        document.getElementById('totalExperiences').textContent = totalExperiences;

        // 获取奖项数量
        const achievementsData = await achievementAPI.getAll();
        const totalAchievements = achievementsData.data ? achievementsData.data.length : 0;
        document.getElementById('totalAchievements').textContent = totalAchievements;

    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
});
