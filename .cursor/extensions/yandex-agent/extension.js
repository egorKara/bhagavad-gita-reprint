const vscode = require('vscode');
const http = require('http');

const AGENT_URL = 'http://46.21.247.218:3001/agent';

class YandexServerAgentProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    async getChildren(element) {
        if (!element) {
            return [
                new AgentItem(
                    '🟡 Yandex Server Agent',
                    'Active',
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'status'
                ),
                new AgentItem(
                    '📊 System Status',
                    'Monitoring',
                    vscode.TreeItemCollapsibleState.None,
                    'status'
                ),
                new AgentItem(
                    '🔒 Security Alerts',
                    'All Clear',
                    vscode.TreeItemCollapsibleState.None,
                    'security'
                ),
                new AgentItem(
                    '📈 Performance',
                    'Optimal',
                    vscode.TreeItemCollapsibleState.None,
                    'performance'
                ),
            ];
        }
        return [];
    }
}

class AgentItem extends vscode.TreeItem {
    constructor(label, description, collapsibleState, contextValue) {
        super(label, collapsibleState);
        this.description = description;
        this.contextValue = contextValue;
        this.tooltip = `${this.label}: ${this.description}`;
    }
}

async function makeAgentRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${AGENT_URL}${endpoint}`;
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

function activate(context) {
    console.log('🟡 Yandex Server Agent extension активировано!');

    const provider = new YandexServerAgentProvider();
    vscode.window.createTreeView('yandexServerAgent', { treeDataProvider: provider });

    // Команды
    const statusCommand = vscode.commands.registerCommand('yandexServerAgent.status', async () => {
        try {
            const status = await makeAgentRequest('/status');
            vscode.window.showInformationMessage(
                `Agent Status: ${JSON.stringify(status, null, 2)}`
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to get status: ${error.message}`);
        }
    });

    const logsCommand = vscode.commands.registerCommand('yandexServerAgent.logs', async () => {
        try {
            const logs = await makeAgentRequest('/logs');
            const doc = await vscode.workspace.openTextDocument({
                content: typeof logs === 'string' ? logs : JSON.stringify(logs, null, 2),
                language: 'log',
            });
            vscode.window.showTextDocument(doc);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to get logs: ${error.message}`);
        }
    });

    const restartCommand = vscode.commands.registerCommand(
        'yandexServerAgent.restart',
        async () => {
            const result = await vscode.window.showWarningMessage(
                'Restart server services?',
                { modal: true },
                'Yes',
                'No'
            );

            if (result === 'Yes') {
                try {
                    await makeAgentRequest('/restart');
                    vscode.window.showInformationMessage('Services restarted successfully!');
                    provider.refresh();
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to restart: ${error.message}`);
                }
            }
        }
    );

    context.subscriptions.push(statusCommand, logsCommand, restartCommand);

    // Автообновление каждые 30 секунд
    /* global setInterval */
    setInterval(() => {
        provider.refresh();
    }, 30000);
}

function deactivate() {
    console.log('🟡 Yandex Server Agent extension деактивировано');
}

module.exports = {
    activate,
    deactivate,
};
