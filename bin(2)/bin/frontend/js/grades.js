let currentGradeId = null;

// 加载成绩列表
async function loadGrades() {
    try {
        const result = await gradeAPI.getAll();
        const tbody = document.getElementById('gradeTableBody');

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">暂无成绩数据</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.map(grade => `
            <tr>
                <td>${grade.course_name}</td>
                <td>${grade.credit}</td>
                <td>${grade.score}</td>
                <td>${grade.grade_point}</td>
                <td>${formatDate(grade.exam_time)}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-action" onclick="editGrade(${grade.id})">编辑</button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteGrade(${grade.id})">删除</button>
                </td>
            </tr>
        `).join('');

        // 加载GPA统计
        loadGPAStats();
    } catch (error) {
        console.error('加载成绩失败:', error);
        showAlert('加载成绩失败', 'danger');
    }
}

// 加载GPA统计
async function loadGPAStats() {
    try {
        const result = await gradeAPI.getGPA();
        document.getElementById('currentGPA').textContent = result.gpa ? result.gpa.toFixed(2) : '0.00';
        document.getElementById('averageScore').textContent = result.average_score ? result.average_score.toFixed(2) : '0.00';
        document.getElementById('totalCredits').textContent = result.total_credits ? result.total_credits.toFixed(1) : '0.0';
    } catch (error) {
        console.error('加载GPA统计失败:', error);
    }
}

// 加载课程列表到下拉框
async function loadCourseOptions() {
    try {
        const result = await courseAPI.getAll();
        const select = document.getElementById('courseId');

        if (result.data && result.data.length > 0) {
            select.innerHTML = '<option value="">请选择课程</option>' +
                result.data.map(course => `
                    <option value="${course.id}">${course.course_name} (${course.semester})</option>
                `).join('');
        }
    } catch (error) {
        console.error('加载课程列表失败:', error);
    }
}

// 打开新增模态框
async function openAddModal() {
    currentGradeId = null;
    document.getElementById('modalTitle').textContent = '录入成绩';
    document.getElementById('gradeForm').reset();
    await loadCourseOptions();
}

// 编辑成绩
async function editGrade(id) {
    try {
        const result = await gradeAPI.get(id);
        if (result.data && result.data.length > 0) {
            const grade = result.data[0];
            currentGradeId = id;

            await loadCourseOptions();

            document.getElementById('modalTitle').textContent = '编辑成绩';
            document.getElementById('courseId').value = grade.course_id;
            document.getElementById('score').value = grade.score;
            document.getElementById('examTime').value = grade.exam_time;

            new bootstrap.Modal(document.getElementById('gradeModal')).show();
        }
    } catch (error) {
        console.error('加载成绩详情失败:', error);
        showAlert('加载成绩详情失败', 'danger');
    }
}

// 保存成绩
async function saveGrade() {
    const data = {
        course_id: parseInt(document.getElementById('courseId').value),
        score: parseFloat(document.getElementById('score').value),
        exam_time: document.getElementById('examTime').value
    };

    if (!data.course_id) {
        showAlert('请选择课程', 'warning');
        return;
    }

    try {
        let result;
        if (currentGradeId) {
            result = await gradeAPI.update(currentGradeId, data);
        } else {
            result = await gradeAPI.create(data);
        }

        if (result.success) {
            showAlert(result.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('gradeModal')).hide();
            loadGrades();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('保存成绩失败:', error);
        showAlert('保存成绩失败', 'danger');
    }
}

// 删除成绩
async function deleteGrade(id) {
    if (!confirm('确定要删除这条成绩记录吗？')) {
        return;
    }

    try {
        const result = await gradeAPI.delete(id);
        if (result.success) {
            showAlert(result.message, 'success');
            loadGrades();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('删除成绩失败:', error);
        showAlert('删除成绩失败', 'danger');
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadGrades();
});
