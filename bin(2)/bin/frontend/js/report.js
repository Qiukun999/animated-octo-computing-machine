async function loadReport() {
    try {
        const report = await reportAPI.get();

        // 加载用户信息
        if (report.user && report.user.data && report.user.data.length > 0) {
            const user = report.user.data[0];
            document.getElementById('userName').textContent = user.real_name || '-';
            document.getElementById('userMajor').textContent = user.major || '-';
            document.getElementById('userGrade').textContent = user.grade || '-';
            document.getElementById('userEmail').textContent = user.email || '-';
        }

        // 加载GPA信息
        if (report.gpa_info) {
            document.getElementById('reportGPA').textContent = report.gpa_info.gpa ? report.gpa_info.gpa.toFixed(2) : '0.00';
            document.getElementById('reportAvgScore').textContent = report.gpa_info.average_score ? report.gpa_info.average_score.toFixed(2) : '0.00';
            document.getElementById('reportCredits').textContent = report.gpa_info.total_credits ? report.gpa_info.total_credits.toFixed(1) : '0.0';
        }

        // 加载课程和成绩
        if (report.grades && report.grades.data && report.grades.data.length > 0) {
            const tbody = document.getElementById('reportCourses');
            tbody.innerHTML = report.grades.data.map(grade => `
                <tr>
                    <td>${grade.course_name}</td>
                    <td>${grade.semester || '-'}</td>
                    <td>${grade.credit}</td>
                    <td>${grade.score}</td>
                    <td>${grade.grade_point}</td>
                </tr>
            `).join('');
        } else {
            document.getElementById('reportCourses').innerHTML = '<tr><td colspan="5" class="text-center">暂无成绩数据</td></tr>';
        }

        // 加载经历
        if (report.experiences && report.experiences.data && report.experiences.data.length > 0) {
            const expDiv = document.getElementById('reportExperiences');
            expDiv.innerHTML = report.experiences.data.map(exp => `
                <div class="mb-3">
                    <h5><span class="badge bg-primary">${exp.exp_type}</span> ${exp.title}</h5>
                    <p class="mb-1"><strong>角色：</strong>${exp.role || '-'} | <strong>时间：</strong>${formatDate(exp.start_date)} ~ ${formatDate(exp.end_date)}</p>
                    ${exp.description ? `<p class="mb-1"><strong>描述：</strong>${exp.description}</p>` : ''}
                    ${exp.skills ? `<p class="mb-0"><strong>技能：</strong>${exp.skills}</p>` : ''}
                </div>
            `).join('');
        } else {
            document.getElementById('reportExperiences').innerHTML = '<p class="text-muted">暂无经历数据</p>';
        }

        // 加载奖项
        if (report.achievements && report.achievements.data && report.achievements.data.length > 0) {
            const achDiv = document.getElementById('reportAchievements');
            achDiv.innerHTML = report.achievements.data.map(ach => `
                <div class="mb-2">
                    <p class="mb-1">
                        <strong>${ach.title}</strong>
                        <span class="badge bg-info ms-2">${ach.category}</span>
                        <span class="badge bg-warning ms-1">${ach.level}</span>
                        <span class="text-muted ms-2">${formatDate(ach.date)}</span>
                    </p>
                    ${ach.description ? `<p class="text-muted mb-0">${ach.description}</p>` : ''}
                </div>
            `).join('');
        } else {
            document.getElementById('reportAchievements').innerHTML = '<p class="text-muted">暂无奖项数据</p>';
        }

    } catch (error) {
        console.error('加载报告失败:', error);
        showAlert('加载报告失败', 'danger');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadReport();
});
