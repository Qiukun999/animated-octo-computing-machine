-- 大学生个人发展规划管理系统数据库初始化脚本

-- 用户表
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50),
    major VARCHAR(100),
    grade VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 课程表
CREATE TABLE IF NOT EXISTS course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    credit REAL NOT NULL,
    course_type VARCHAR(50),
    teacher VARCHAR(50),
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 成绩表
CREATE TABLE IF NOT EXISTS grade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    score REAL NOT NULL,
    grade_point REAL NOT NULL,
    exam_time DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- 经历表
CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    exp_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    role VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    skills VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 奖项表
CREATE TABLE IF NOT EXISTS achievement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    level VARCHAR(50),
    date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 插入默认用户（用于演示）
INSERT OR IGNORE INTO user (id, username, password, real_name, major, grade, email)
VALUES (1, 'demo', 'demo123', '张三', '计算机科学与技术', '2022级', 'demo@example.com');

-- 插入示例课程数据
INSERT OR IGNORE INTO course (user_id, course_name, semester, credit, course_type, teacher, remark)
VALUES
(1, '高等数学A(上)', '2022-2023-1', 5.0, '必修', '李教授', ''),
(1, '程序设计基础', '2022-2023-1', 3.0, '必修', '王老师', ''),
(1, '大学英语(一)', '2022-2023-1', 2.0, '必修', '刘老师', '');

-- 插入示例成绩数据
INSERT OR IGNORE INTO grade (user_id, course_id, score, grade_point, exam_time)
VALUES
(1, 1, 92, 4.0, '2023-01-10'),
(1, 2, 88, 3.7, '2023-01-12'),
(1, 3, 85, 3.7, '2023-01-08');

-- 插入示例经历数据
INSERT OR IGNORE INTO experience (user_id, exp_type, title, role, start_date, end_date, description, skills)
VALUES
(1, '项目经历', '学生管理系统开发', '后端开发', '2023-03-01', '2023-06-30', '负责后端API设计与实现', 'C++, SQLite, RESTful API'),
(1, '竞赛经历', '全国大学生数学建模竞赛', '队长', '2023-09-15', '2023-09-18', '带领团队完成建模任务', '数学建模, Python, 数据分析');

-- 插入示例奖项数据
INSERT OR IGNORE INTO achievement (user_id, title, category, level, date, description)
VALUES
(1, '国家奖学金', '奖学金', '国家级', '2023-11-01', '学习成绩优异'),
(1, '数学建模竞赛省一等奖', '竞赛奖项', '省级', '2023-10-15', '全国大学生数学建模竞赛');
