let currentExperienceId = null;

async function loadExperiences() {
    try {
        const result = await experienceAPI.getAll();
        const tbody = document.getElementById('experienceTableBody');

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">暂无经历数据</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.map(exp => `
            <tr>
                <td><span class="badge bg-primary">${exp.exp_type}</span></td>
                <td>${exp.title}</td>
                <td>${exp.role || '-'}</td>
                <td>${formatDate(exp.start_date)} ~ ${formatDate(exp.end_date)}</td>
                <td>${exp.skills || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-action" onclick="editExperience(${exp.id})">编辑</button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteExperience(${exp.id})">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载经历失败:', error);
        showAlert('加载经历失败', 'danger');
    }
}

function openAddModal() {
    currentExperienceId = null;
    document.getElementById('modalTitle').textContent = '新增经历';
    document.getElementById('experienceForm').reset();
}

async function editExperience(id) {
    try {
        const result = await experienceAPI.get(id);
        if (result.data && result.data.length > 0) {
            const exp = result.data[0];
            currentExperienceId = id;

            document.getElementById('modalTitle').textContent = '编辑经历';
            document.getElementById('expType').value = exp.exp_type;
            document.getElementById('title').value = exp.title;
            document.getElementById('role').value = exp.role || '';
            document.getElementById('startDate').value = exp.start_date;
            document.getElementById('endDate').value = exp.end_date;
            document.getElementById('description').value = exp.description || '';
            document.getElementById('skills').value = exp.skills || '';

            new bootstrap.Modal(document.getElementById('experienceModal')).show();
        }
    } catch (error) {
        console.error('加载经历详情失败:', error);
        showAlert('加载经历详情失败', 'danger');
    }
}

async function saveExperience() {
    const data = {
        exp_type: document.getElementById('expType').value,
        title: document.getElementById('title').value,
        role: document.getElementById('role').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        description: document.getElementById('description').value,
        skills: document.getElementById('skills').value
    };

    try {
        let result;
        if (currentExperienceId) {
            result = await experienceAPI.update(currentExperienceId, data);
        } else {
            result = await experienceAPI.create(data);
        }

        if (result.success) {
            showAlert(result.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('experienceModal')).hide();
            loadExperiences();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('保存经历失败:', error);
        showAlert('保存经历失败', 'danger');
    }
}

async function deleteExperience(id) {
    if (!confirm('确定要删除这条经历吗？')) return;

    try {
        const result = await experienceAPI.delete(id);
        if (result.success) {
            showAlert(result.message, 'success');
            loadExperiences();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('删除经历失败:', error);
        showAlert('删除经历失败', 'danger');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadExperiences();
});
