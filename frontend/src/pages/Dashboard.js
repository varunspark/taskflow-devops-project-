import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadProjects = async () => {
    setLoading(true);
    const res = await api.get('/projects');
    setProjects(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/projects', { name, description });
    setName('');
    setDescription('');
    loadProjects();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <header className="top-bar">
        <h1>TaskFlow</h1>
        <div>
          <span className="welcome-text">Hi, {user?.fullName || user?.username}</span>
          <button className="secondary" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <section className="content">
        <h2>Your Projects</h2>

        <form className="inline-form" onSubmit={handleCreate}>
          <input
            placeholder="New project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">+ Create Project</button>
        </form>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="empty-state">No projects yet. Create your first one above.</p>
        ) : (
          <div className="card-grid">
            {projects.map((p) => (
              <Link to={`/projects/${p.id}`} key={p.id} className="card">
                <h3>{p.name}</h3>
                <p>{p.description || 'No description'}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
