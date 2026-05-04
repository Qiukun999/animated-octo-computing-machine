let currentCourseId = null;

// 加载课程列表
async function loadCourses() {
    try {
        const result = await courseAPI.getAll();
        const tbody = document.getElementById('courseTableBody');

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">暂无课程数据</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.map(course => `
            <tr>
                <td>${course.course_name}</td>
                <td>${course.semester}</td>
                <td>${course.credit}</td>
                <td>${course.course_type}</td>
                <td>${course.teacher || '-'}</td>
                <td>${course.remark || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-action" onclick="editCourse(${course.id})">编辑</button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteCourse(${course.id})">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载课程失败:', error);
        showAlert('加载课程失败', 'danger');
    }
}

// 打开新增模态框
function openAddModal() {
    currentCourseId = null;
    document.getElementById('modalTitle').textContent = '新增课程';
    document.getElementById('courseForm').reset();
}

// 编辑课程
async function editCourse(id) {
    try {
        const result = await courseAPI.get(id);
        if (result.data && result.data.length > 0) {
            const course = result.data[0];
            currentCourseId = id;

            document.getElementById('modalTitle').textContent = '编辑课程';
            document.getElementById('courseName').value = course.course_name;
            document.getElementById('semester').value = course.semester;
            document.getElementById('credit').value = course.credit;
            document.getElementById('courseType').value = course.course_type;
            document.getElementById('teacher').value = course.teacher || '';
            document.getElementById('remark').value = course.remark || '';

            new bootstrap.Modal(document.getElementById('courseModal')).show();
        }
    } catch (error) {
        console.error('加载课程详情失败:', error);
        showAlert('加载课程详情失败', 'danger');
    }
}

// 保存课程
async function saveCourse() {
    const data = {
        course_name: document.getElementById('courseName').value,
        semester: document.getElementById('semester').value,
        credit: parseFloat(document.getElementById('credit').value),
        course_type: document.getElementById('courseType').value,
        teacher: document.getElementById('teacher').value,
        remark: document.getElementById('remark').value
    };

    try {
        let result;
        if (currentCourseId) {
            result = await courseAPI.update(currentCourseId, data);
        } else {
            result = await courseAPI.create(data);
        }

        if (result.success) {
            showAlert(result.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
            loadCourses();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('保存课程失败:', error);
        showAlert('保存课程失败', 'danger');
    }
}

// 删除课程
async function deleteCourse(id) {
    if (!confirm('确定要删除这门课程吗？')) {
        return;
    }

    try {
        const result = await courseAPI.delete(id);
        if (result.success) {
            showAlert(result.message, 'success');
            loadCourses();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('删除课程失败:', error);
        showAlert('删除课程失败', 'danger');
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
});
