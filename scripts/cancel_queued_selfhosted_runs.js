#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

function readGitConfig(repoRoot) {
    const gitConfigPath = path.join(repoRoot, '.git', 'config');
    const content = fs.readFileSync(gitConfigPath, 'utf8');
    return content;
}

function parseOriginInfo(configText) {
    // Match URL like: https://x-access-token:TOKEN@github.com/owner/repo(.git)
    const urlMatch = configText.match(/url\s*=\s*(.+)/);
    if (!urlMatch) throw new Error('Remote origin URL not found in .git/config');
    const url = urlMatch[1].trim();
    const m = url.match(/https:\/\/x-access-token:([^@]+)@github\.com\/(.+?)(?:\.git)?$/);
    if (!m) throw new Error('Unsupported origin URL format');
    const token = m[1];
    const slug = m[2];
    const [owner, repo] = slug.split('/');
    if (!owner || !repo) throw new Error('Failed to parse owner/repo from origin URL');
    return { token, owner, repo };
}

function requestJson({ method, pathname, token, body }) {
    const options = {
        method,
        hostname: 'api.github.com',
        path: pathname,
        headers: {
            'User-Agent': 'cursor-automation',
            Accept: 'application/vnd.github+json',
            Authorization: `token ${token}`,
        },
    };
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                const status = res.statusCode || 0;
                const ok = status >= 200 && status < 300;
                if (!data)
                    return ok ? resolve({ status, json: {} }) : reject(new Error(`HTTP ${status}`));
                try {
                    const json = JSON.parse(data);
                    if (ok) resolve({ status, json });
                    else reject(new Error(`HTTP ${status}: ${JSON.stringify(json)}`));
                } catch (e) {
                    if (ok) resolve({ status, json: {} });
                    else reject(new Error(`HTTP ${status}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function listWorkflows(owner, repo, token) {
    const { json } = await requestJson({
        method: 'GET',
        pathname: `/repos/${owner}/${repo}/actions/workflows?per_page=100`,
        token,
    });
    return json.workflows || [];
}

async function listRuns(owner, repo, workflowId, token, status) {
    let page = 1;
    const runs = [];
    while (true) {
        const { json } = await requestJson({
            method: 'GET',
            pathname: `/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs?status=${status}&per_page=100&page=${page}`,
            token,
        });
        const items = json.workflow_runs || [];
        runs.push(...items);
        if (items.length < 100) break;
        page += 1;
        if (page > 20) break; // safety
    }
    return runs;
}

async function cancelRun(owner, repo, runId, token) {
    try {
        await requestJson({
            method: 'POST',
            pathname: `/repos/${owner}/${repo}/actions/runs/${runId}/cancel`,
            token,
        });
        return 'canceled';
    } catch (e) {
        // Try delete as fallback for queued
        try {
            await requestJson({
                method: 'DELETE',
                pathname: `/repos/${owner}/${repo}/actions/runs/${runId}`,
                token,
            });
            return 'deleted';
        } catch (e2) {
            return 'failed';
        }
    }
}

(async () => {
    try {
        const repoRoot = process.cwd();
        const cfg = readGitConfig(repoRoot);
        const { token, owner, repo } = parseOriginInfo(cfg);

        const workflows = await listWorkflows(owner, repo, token);
        const target = workflows.find((w) => w.path === '.github/workflows/deploy.yml');
        if (!target) {
            console.log('Self-hosted workflow deploy.yml not found. Nothing to cancel.');
            process.exit(0);
        }

        let totalCanceled = 0;
        let totalDeleted = 0;
        let totalFailed = 0;

        for (const status of ['queued', 'in_progress']) {
            const runs = await listRuns(owner, repo, target.id, token, status);
            if (!runs.length) continue;
            for (const r of runs) {
                const result = await cancelRun(owner, repo, r.id, token);
                if (result === 'canceled') totalCanceled += 1;
                else if (result === 'deleted') totalDeleted += 1;
                else totalFailed += 1;
            }
        }

        console.log(
            JSON.stringify({ canceled: totalCanceled, deleted: totalDeleted, failed: totalFailed })
        );
    } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
})();
