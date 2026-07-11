import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

export default function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const [taskRes, commentsRes, activityRes] = await Promise.all([
      api.get(`/tasks/${taskId}`),
      api.get(`/comments/task/${taskId}`),
      api.get(`/tasks/${taskId}/activity`),
    ]);
    setTask(taskRes.data);
    setComments(commentsRes.data);
    setActivity(activityRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await api.post('/comments', { taskId: Number(taskId), text: commentText });
    setCommentText('');
    load();
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <header className="top-bar">
        <button className="link-back" onClick={() => navigate(-1)}>&larr; Back</button>
        <h1>{task?.title}</h1>
      </header>

      <section className="content two-column">
        <div>
          <h2>Details</h2>
          <p>{task?.description || 'No description provided.'}</p>
          <p><strong>Status:</strong> {task?.status}</p>
          <p><strong>Priority:</strong> {task?.priority}</p>

          <h2>Comments</h2>
          <p className="db-note">Stored in MongoDB (flexible, high-write collection)</p>
          <form className="inline-form" onSubmit={handleAddComment}>
            <input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>

          {comments.length === 0 ? (
            <p className="empty-state">No comments yet.</p>
          ) : (
            <ul className="comment-list">
              {comments.map((c) => (
                <li key={c.id}>
                  <strong>{c.username}</strong>
                  <p>{c.text}</p>
                  <span className="timestamp">{new Date(c.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2>Activity Log</h2>
          <p className="db-note">Stored in MongoDB (append-only audit trail)</p>
          {activity.length === 0 ? (
            <p className="empty-state">No activity yet.</p>
          ) : (
            <ul className="activity-list">
              {activity.map((a) => (
                <li key={a.id}>
                  <span className="activity-action">{a.action.replaceAll('_', ' ')}</span>
                  <span> by {a.performedBy}</span>
                  <span className="timestamp"> — {new Date(a.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
