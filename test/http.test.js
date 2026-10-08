import test from 'node:test';
import assert from 'node:assert/strict';
import {server} from '../src/server.js';

test('HTTP approval returns to exact waiting task and blocks replay', async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const request = async (path, method = 'GET', body) => {
    const response = await fetch(url + path, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: body ? JSON.stringify(body) : undefined
    });
    return {status: response.status, payload: await response.json()};
  };
  try {
    const html = await fetch(url + '/');
    assert.equal(html.status, 200);
    const page = await html.text();
    assert.match(page, /human:\/\//);
    assert.match(page, /exact-session human boundary demo/);
    const labPage = await fetch(url + '/lab');
    assert.equal(labPage.status, 200);
    const labHTML = await labPage.text();
    assert.match(labHTML, /Create demo A . B/);
    assert.match(labHTML, /Replay approval/);

    const a = await request('/api/tasks', 'POST', {
      title: 'Task A', operation: 'Simulate checkout deployment'
    });
    const b = await request('/api/tasks', 'POST', {
      title: 'Task B', operation: 'Simulate key rotation'
    });
    assert.equal(a.status, 201);
    assert.equal(b.status, 201);
    assert.notEqual(a.payload.task.id, b.payload.task.id);

    const approve = await request(`/api/tasks/${a.payload.task.id}/decision`, 'POST', {
      actor: 'human:reviewer', decision: 'approve'
    });
    assert.equal(approve.status, 200);
    assert.equal(approve.payload.task.status, 'simulated_completed');

    const beforeReplay = await request('/api/state');
    const count = beforeReplay.payload.events.length;
    assert.equal(beforeReplay.payload.tasks.find(t => t.id === b.payload.task.id).status, 'awaiting_human');

    const replay = await request(`/api/tasks/${a.payload.task.id}/decision`, 'POST', {
      actor: 'human:reviewer', decision: 'approve'
    });
    assert.equal(replay.status, 409);

    const afterReplay = await request('/api/state');
    assert.equal(afterReplay.payload.events.length, count);

    const reject = await request(`/api/tasks/${b.payload.task.id}/decision`, 'POST', {
      actor: 'human:reviewer', decision: 'reject'
    });
    assert.equal(reject.status, 200);
    assert.equal(reject.payload.task.status, 'rejected');
    const finalState = (await request('/api/state')).payload;
    assert.equal(finalState.events.filter(e => e.taskId === a.payload.task.id && e.type === 'simulation.continued').length, 1);
    assert.equal(finalState.events.filter(e => e.taskId === b.payload.task.id && e.type === 'simulation.stopped').length, 1);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
