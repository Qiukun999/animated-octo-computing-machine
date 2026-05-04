let currentAchievementId = null;

async function loadAchievements() {
    try {
        const result = await achievementAPI.getAll();
        const tbody = document.getElementById('achievementTableBody');

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">暂无奖项数据</td></tr>';
            return;
        }

        tbody.innerHTML = result.data.map(achievement => `
            <tr>
                <td>${achievement.title}</td>
                <td><span class="badge bg-info">${achievement.category}</span></td>
                <td><span class="badge bg-warning">${achievement.level}</span></td>
                <td>${formatDate(achievement.date)}</td>
                <td>${achievement.description || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-action" onclick="editAchievement(${achievement.id})">编辑</button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteAchievement(${achievement.id})">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载奖项失败:', error);
        showAlert('加载奖项失败', 'danger');
    }
}

function openAddModal() {
    currentAchievementId = null;
    document.getElementById('modalTitle').textContent = '新增奖项';
    document.getElementById('achievementForm').reset();
}

async function editAchievement(id) {
    try {
        const result = await achievementAPI.get(id);
        if (result.data && result.data.length > 0) {
            const achievement = result.data[0];
            currentAchievementId = id;

            document.getElementById('modalTitle').textContent = '编辑奖项';
            document.getElementById('title').value = achievement.title;
            document.getElementById('category').value = achievement.category;
            document.getElementById('level').value = achievement.level;
            document.getElementById('date').value = achievement.date;
            document.getElementById('description').value = achievement.description || '';

            new bootstrap.Modal(document.getElementById('achievementModal')).show();
        }
    } catch (error) {
        console.error('加载奖项详情失败:', error);
        showAlert('加载奖项详情失败', 'danger');
    }
}

async function saveAchievement() {
    const data = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        level: document.getElementById('level').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        let result;
        if (currentAchievementId) {
            result = await achievementAPI.update(currentAchievementId, data);
        } else {
            result = await achievementAPI.create(data);
        }

        if (result.success) {
            showAlert(result.message, 'success');
            bootstrap.Modal.getInstance(document.getElementById('achievementModal')).hide();
            loadAchievements();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('保存奖项失败:', error);
        showAlert('保存奖项失败', 'danger');
    }
}

async function deleteAchievement(id) {
    if (!confirm('确定要删除这个奖项吗？')) return;

    try {
        const result = await achievementAPI.delete(id);
        if (result.success) {
            showAlert(result.message, 'success');
            loadAchievements();
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('删除奖项失败:', error);
        showAlert('删除奖项失败', 'danger');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAchievements();
});
