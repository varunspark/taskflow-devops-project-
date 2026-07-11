import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const [projectRes, tasksRes] = await Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/tasks/project/${projectId}`),
    ]);
    setProject(projectRes.data);
    setTasks(tasksRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post('/tasks', { title, projectId: Number(projectId), priority, status: 'TODO' });
    setTitle('');
    load();
  };

  const handleStatusChange = async (task, newStatus) => {
    await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
    load();
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <header className="top-bar">
        <div>
          <button className="link-back" onClick={() => navigate('/dashboard')}>&larr; Back</button>
          <h1>{project?.name}</h1>
        </div>
      </header>

      <section className="content">
        <p className="project-description">{project?.description}</p>

        <form className="inline-form" onSubmit={handleCreateTask}>
          <input
            placeholder="New task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <button type="submit">+ Add Task</button>
        </form>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet.</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/tasks/${t.id}`}>{t.title}</Link>
                  </td>
                  <td>
                    <span className={`badge priority-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                  </td>
                  <td>
                    <select value={t.status} onChange={(e) => handleStatusChange(t, e.target.value)}>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Link to={`/tasks/${t.id}`} className="link-view">View &rarr;</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
