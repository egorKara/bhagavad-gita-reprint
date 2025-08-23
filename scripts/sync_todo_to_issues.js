#!/usr/bin/env node
/*
 Синхронизация PROJECT_TODO.md <-> GitHub Issues
 - Создаёт Issues для новых задач
 - Закрывает Issues для задач, отмеченных галочкой
 Требуются переменные окружения: GITHUB_REPOSITORY, GITHUB_TOKEN
*/

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

function parseTodo(filePath) {
    const md = fs.readFileSync(filePath, 'utf8');
    const lines = md.split('\n');
    const tasks = [];
    for (const line of lines) {
        const m = line.match(/^\s*- \[( |x|X)\] (.+)$/);
        if (m) {
            tasks.push({ done: m[1].toLowerCase() === 'x', title: m[2].trim() });
        }
    }
    return tasks;
}

async function main() {
    const repoFull = process.env.GITHUB_REPOSITORY;
    const token = process.env.GITHUB_TOKEN || process.env.PAT_TOKEN;
    if (!repoFull || !token) {
        console.error('Env GITHUB_REPOSITORY and GITHUB_TOKEN are required');
        process.exit(1);
    }
    const [owner, repo] = repoFull.split('/');
    const octokit = new Octokit({ auth: token });

    const todoPath = path.join(process.cwd(), 'PROJECT_TODO.md');
    const tasks = parseTodo(todoPath);
    const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'all',
        per_page: 100
    });

    const issueMap = new Map();
    for (const is of issues) {
        issueMap.set(is.title.trim(), is);
    }

    // Создаём/закрываем
    for (const task of tasks) {
        const existing = issueMap.get(task.title);
        if (!existing && !task.done) {
            await octokit.issues.create({
                owner,
                repo,
                title: task.title,
                labels: ['agent', 'todo']
            });
            console.log('Created issue:', task.title);
        } else if (existing) {
            const desiredState = task.done ? 'closed' : 'open';
            if (existing.state !== desiredState) {
                await octokit.issues.update({
                    owner,
                    repo,
                    issue_number: existing.number,
                    state: desiredState
                });
                console.log('Updated issue state:', task.title, '->', desiredState);
            }
            // Обновляем labels
            const labels = new Set(existing.labels.map((l) => (typeof l === 'string' ? l : l.name)));
            labels.add('agent');
            if (task.done) {
                labels.delete('todo');
                labels.add('done');
            } else {
                labels.add('todo');
                labels.delete('done');
            }
            await octokit.issues.update({
                owner,
                repo,
                issue_number: existing.number,
                labels: Array.from(labels)
            });
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
