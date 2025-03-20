// 主要JavaScript文件用于职位列表应用
document.addEventListener('DOMContentLoaded', function() {
  // DOM元素
  const jobsContainer = document.getElementById('jobs-container');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  // 存储所有职位数据
  let allJobs = [];
  
  // API 基础URL
  const API_BASE_URL = '/api';

  // 从API获取所有职位
  async function fetchJobs() {
    try {
      showLoading();
      const response = await fetch(`${API_BASE_URL}/jobs`);
      
      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态码: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        allJobs = data.data;
        renderJobs(allJobs);
      } else {
        showError('获取职位数据失败');
      }
    } catch (error) {
      console.error('获取职位数据时发生错误:', error);
      showError('获取职位数据时发生错误. 请稍后再试.');
    }
  }
  
  // 渲染职位到页面
  function renderJobs(jobs) {
    // 清空容器
    jobsContainer.innerHTML = '';
    
    // 如果没有职位数据
    if (jobs.length === 0) {
      jobsContainer.innerHTML = '<div class="no-jobs">没有找到职位</div>';
      return;
    }
    
    // 创建职位卡片并添加到容器
    const jobsList = document.createElement('div');
    jobsList.className = 'jobs-grid';
    
    jobs.forEach(job => {
      const jobCard = createJobCard(job);
      jobsList.appendChild(jobCard);
    });
    
    jobsContainer.appendChild(jobsList);
  }
  
  // 创建单个职位卡片
  function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.dataset.jobId = job.id;
    
    // 格式化日期
    const postedDate = new Date(job.posted_date || job.created_at || Date.now());
    const formattedDate = postedDate.toLocaleDateString('zh-CN');
    
    // 设置薪资范围显示
    const salary = job.salary_range 
      ? job.salary_range 
      : job.min_salary && job.max_salary 
        ? `${job.min_salary}-${job.max_salary}` 
        : '薪资面议';
    
    card.innerHTML = `
      <h3 class="job-title">${job.title}</h3>
      <h4 class="job-company">${job.company}</h4>
      <div class="job-location">${job.location || '地点未指定'}</div>
      <div class="job-salary">${salary}</div>
      <div class="job-description">${job.description || '没有描述'}</div>
      <div class="job-footer">
        <span class="job-date">发布于: ${formattedDate}</span>
        <button class="job-apply-btn" data-job-id="${job.id}">申请</button>
      </div>
    `;
    
    // 添加申请按钮事件
    const applyButton = card.querySelector('.job-apply-btn');
    applyButton.addEventListener('click', function(e) {
      e.stopPropagation();
      handleJobApply(job.id);
    });
    
    // 添加卡片点击事件以查看详情
    card.addEventListener('click', function() {
      viewJobDetails(job.id);
    });
    
    return card;
  }
  
  // 显示加载状态
  function showLoading() {
    jobsContainer.innerHTML = '<div class="loading">加载中...</div>';
  }
  
  // 显示错误信息
  function showError(message) {
    jobsContainer.innerHTML = `<div class="error-message">${message}</div>`;
  }
  
  // 处理职位申请
  function handleJobApply(jobId) {
    alert(`您正在申请ID为 ${jobId} 的职位。此功能尚未实现。`);
    // 这里可以添加实际的申请逻辑，如打开申请表单或跳转到申请页面
  }
  
  // 查看职位详情
  function viewJobDetails(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (job) {
      alert(`查看职位: ${job.title} 详情功能尚未实现`);
      // 这里可以添加查看详情的逻辑，如打开模态框或跳转到详情页面
    }
  }
  
  // 处理搜索功能
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
      renderJobs(allJobs);
      return;
    }
    
    const filteredJobs = allJobs.filter(job => {
      return (
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        (job.description && job.description.toLowerCase().includes(searchTerm)) ||
        (job.location && job.location.toLowerCase().includes(searchTerm))
      );
    });
    
    renderJobs(filteredJobs);
  }
  
  // 添加搜索事件监听器
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  });
  
  // 初始化 - 获取职位数据
  fetchJobs();
});