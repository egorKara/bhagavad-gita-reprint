const SecurityAgent = require('../src/services/security-agent');
const fs = require('fs');
const path = require('path');

// Создаем временные тестовые файлы
const createTestFiles = () => {
  const testDir = path.join(__dirname, 'test-files');
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Файл с API ключом
  fs.writeFileSync(path.join(testDir, 'api-config.js'), `
module.exports = {
  openai: {
    apiKey: "sk-1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  github: {
    token: "ghp_abcdef1234567890abcdef1234567890abcdef"
  }
};
`);
  
  // Файл с паролем
  fs.writeFileSync(path.join(testDir, 'database.js'), `
const config = {
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  username: 'admin',
  password: 'super_secret_password_123'
};
`);
  
  // Файл с AWS ключами
  fs.writeFileSync(path.join(testDir, 'aws-config.js'), `
const awsConfig = {
  accessKeyId: "AKIA1234567890ABCDEF",
  secretAccessKey: "abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890"
};
`);
  
  // Файл без секретов
  fs.writeFileSync(path.join(testDir, 'safe-file.js'), `
const config = {
  port: 3000,
  debug: true,
  environment: 'development'
};
`);
  
  return testDir;
};

// Очищаем тестовые файлы
const cleanupTestFiles = (testDir) => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
};

// Основные тесты
describe('Cursor Security Agent Tests', () => {
  let agent;
  let testDir;
  
  beforeAll(() => {
    testDir = createTestFiles();
    agent = new SecurityAgent();
  });
  
  afterAll(() => {
    cleanupTestFiles(testDir);
  });
  
  test('Агент должен быть создан', () => {
    expect(agent).toBeDefined();
    expect(agent.secretsPatterns).toBeDefined();
    expect(agent.excludePatterns).toBeDefined();
  });
  
  test('Агент должен обнаруживать API ключи', async () => {
    const apiFile = path.join(testDir, 'api-config.js');
    const result = await agent.scanFile(apiFile);
    
    expect(result).toBeDefined();
    expect(result.findings).toBeDefined();
    expect(result.findings.length).toBeGreaterThan(0);
    
    const apiKeyFinding = result.findings.find(f => 
      f.pattern.toString().includes('api') || 
      f.matches.some(m => m.includes('sk-'))
    );
    
    expect(apiKeyFinding).toBeDefined();
  });
  
  test('Агент должен обнаруживать пароли', async () => {
    const dbFile = path.join(testDir, 'database.js');
    const result = await agent.scanFile(dbFile);
    
    expect(result).toBeDefined();
    expect(result.findings).toBeDefined();
    
    const passwordFinding = result.findings.find(f => 
      f.pattern.toString().includes('password')
    );
    
    expect(passwordFinding).toBeDefined();
  });
  
  test('Агент должен обнаруживать AWS ключи', async () => {
    const awsFile = path.join(testDir, 'aws-config.js');
    const result = await agent.scanFile(awsFile);
    
    expect(result).toBeDefined();
    expect(result.findings).toBeDefined();
    
    const awsFinding = result.findings.find(f => 
      f.pattern.toString().includes('AKIA') ||
      f.matches.some(m => m.includes('AKIA'))
    );
    
    expect(awsFinding).toBeDefined();
  });
  
  test('Агент не должен находить секреты в безопасных файлах', async () => {
    const safeFile = path.join(testDir, 'safe-file.js');
    const result = await agent.scanFile(safeFile);
    
    expect(result).toBeNull();
  });
  
  test('Агент должен корректно сканировать директорию', async () => {
    const results = await agent.scanDirectory(testDir, 1);
    
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Должны найти 3 файла с секретами
    const filesWithSecrets = results.filter(r => r !== null);
    expect(filesWithSecrets.length).toBe(3);
  });
  
  test('Агент должен генерировать отчеты', async () => {
    // Сначала сканируем
    const results = await agent.scanDirectory(testDir, 1);
    agent.scanResults = results.filter(r => r !== null);
    agent.lastScanTime = new Date();
    
    const report = await agent.generateReport();
    
    expect(report).toBeDefined();
    expect(report.timestamp).toBeDefined();
    expect(report.totalFiles).toBeGreaterThan(0);
    expect(report.details).toBeDefined();
    
    // Проверяем что отчет сохранен
    const reportPath = path.join(process.cwd(), 'security-scan-report.json');
    expect(fs.existsSync(reportPath)).toBe(true);
    
    // Очищаем тестовый отчет
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
  });
  
  test('Агент должен создавать инструкции для GitHub Secrets', async () => {
    const results = await agent.scanDirectory(testDir, 1);
    const validResults = results.filter(r => r !== null);
    
    await agent.createGitHubSecrets(validResults);
    
    const secretsFile = path.join(process.cwd(), 'github-secrets-to-create.md');
    expect(fs.existsSync(secretsFile)).toBe(true);
    
    const content = fs.readFileSync(secretsFile, 'utf8');
    expect(content).toContain('GitHub Secrets для создания');
    expect(content).toContain('Автоматически обнаруженные секреты');
    
    // Очищаем тестовый файл
    if (fs.existsSync(secretsFile)) {
      fs.unlinkSync(secretsFile);
    }
  });
  
  test('Агент должен корректно рассчитывать критичность', () => {
    const sshPattern = /-----BEGIN\s+(RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----/gi;
    const apiPattern = /api[_-]?key[_-]?[a-zA-Z0-9]*\s*[:=]\s*['"`]?[a-zA-Z0-9]{32,}['"`]?/gi;
    const passwordPattern = /password\s*[:=]\s*['"`]?[^'"`\s]+['"`]?/gi;
    
    expect(agent.calculateSeverity(sshPattern, ['test'])).toBe('CRITICAL');
    expect(agent.calculateSeverity(apiPattern, ['test'])).toBe('HIGH');
    expect(agent.calculateSeverity(passwordPattern, ['test'])).toBe('MEDIUM');
  });
  
  test('Агент должен корректно находить номера строк', () => {
    const content = `line 1
line 2 with secret: sk-1234567890abcdef
line 3
line 4 with another secret: ghp_abcdef1234567890abcdef1234567890abcdef`;
    
    const matches = ['sk-1234567890abcdef', 'ghp_abcdef1234567890abcdef1234567890abcdef'];
    const lineNumbers = agent.findLineNumbers(content, matches);
    
    expect(lineNumbers).toContain(2);
    expect(lineNumbers).toContain(4);
  });
  
  test('Агент должен корректно управлять статусом', () => {
    expect(agent.getStats().isRunning).toBe(false);
    expect(agent.getStats().isMonitoring).toBe(false);
    
    // Симулируем запуск мониторинга
    agent.monitoringInterval = setInterval(() => {}, 1000);
    expect(agent.getStats().isMonitoring).toBe(true);
    
    // Очищаем интервал
    clearInterval(agent.monitoringInterval);
    agent.monitoringInterval = null;
  });
});

// Тест производительности
describe('Performance Tests', () => {
  test('Агент должен эффективно сканировать большие файлы', async () => {
    const agent = new SecurityAgent();
    
    // Создаем большой тестовый файл
    const largeContent = 'const config = {\n'.repeat(1000) + 
                        '  apiKey: "sk-1234567890abcdef1234567890abcdef1234567890abcdef"\n' +
                        '};\n'.repeat(1000);
    
    const testFile = path.join(__dirname, 'large-test-file.js');
    fs.writeFileSync(testFile, largeContent);
    
    const startTime = Date.now();
    const result = await agent.scanFile(testFile);
    const scanTime = Date.now() - startTime;
    
    expect(result).toBeDefined();
    expect(scanTime).toBeLessThan(1000); // Должно сканировать менее чем за 1 секунду
    
    // Очищаем
    fs.unlinkSync(testFile);
  });
});

console.log('🧪 Тесты Cursor Security Agent готовы к запуску!');
console.log('Для запуска: npm test');
console.log('Для запуска с отладкой: DEBUG=* npm test');