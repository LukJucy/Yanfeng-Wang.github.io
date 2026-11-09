/* Site IDs are public identifiers. Never put access tokens or client secrets here. */
(async () => {
  const setup = document.getElementById('setup');
  try {
    const response = await fetch('./config.yml', { cache: 'no-store' });
    if (!response.ok) throw new Error('无法读取后台配置。');
    const config = await response.json(); // JSON is also valid YAML.
    if (!config.backend.turbo_site_id) {
      setup.innerHTML = '<h1>后台已准备好，等待连接账号</h1>' +
        '<p>还需要完成一次 Decap Turbo 授权，才能登录并保存主页修改。</p>' +
        '<ol><li>打开 <a href="https://turbo.decapcms.org/" target="_blank" rel="noopener noreferrer">Decap Turbo</a>，选择免费方案。</li>' +
        '<li>添加仓库 <strong>LukJucy/Yanfeng-Wang.github.io</strong>，将 GitHub App 限定到此仓库。</li>' +
        '<li>在站点 Overview 中将 Admin interface URL 设为本后台地址，并复制 Site ID。</li>' +
        '<li>把 Site ID 发给维护者完成连接。无需提供密码或密钥。</li></ol>' +
        '<p><a href="../">返回学术主页</a> · <a href="https://decapcms.org/docs/turbo-connecting-a-site/">官方接入说明</a></p>';
      return;
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/decap-cms@3.17.3/dist/decap-cms.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('编辑器加载失败，请刷新页面重试。'));
      document.head.append(script);
    });
    const preview = document.createElement('script');
    preview.src = './preview.js';
    await new Promise((resolve, reject) => {
      preview.onload = resolve;
      preview.onerror = () => reject(new Error('预览加载失败，请刷新页面重试。'));
      document.head.append(preview);
    });
    window.CMS.init({ config: { ...config, load_config_file: false } });
    setup.remove();
  } catch (error) {
    setup.replaceChildren();
    const heading = document.createElement('h1');
    heading.textContent = '暂时无法加载后台';
    const details = document.createElement('p');
    details.textContent = error.message;
    setup.append(heading, details);
  }
})();
