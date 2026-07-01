import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineCube, HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineTrash, HiOutlineTag } from 'react-icons/hi';
import { getDashboard } from '../services/historyService';
import Loader from '../components/Loader';

const statCards = [
  { key: 'totalEmployees', label: 'Employees', icon: HiOutlineUsers, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', iconBg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
  { key: 'totalAssets', label: 'Total Assets', icon: HiOutlineCube, gradient: 'linear-gradient(135deg, #0891b2, #22d3ee)', iconBg: 'rgba(34,211,238,0.15)', iconColor: '#22d3ee' },
  { key: 'availableAssets', label: 'Available', icon: HiOutlineCheckCircle, gradient: 'linear-gradient(135deg, #059669, #34d399)', iconBg: 'rgba(52,211,153,0.15)', iconColor: '#34d399' },
  { key: 'issuedAssets', label: 'Issued', icon: HiOutlineExclamation, gradient: 'linear-gradient(135deg, #d97706, #fbbf24)', iconBg: 'rgba(251,191,36,0.15)', iconColor: '#fbbf24' },
  { key: 'scrappedAssets', label: 'Scrapped', icon: HiOutlineTrash, gradient: 'linear-gradient(135deg, #dc2626, #fb7185)', iconBg: 'rgba(251,113,133,0.15)', iconColor: '#fb7185' },
  { key: 'totalCategories', label: 'Categories', icon: HiOutlineTag, gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)', iconBg: 'rgba(167,139,250,0.15)', iconColor: '#a78bfa' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const stats = data?.stats || {};
  const recentHistory = data?.recentHistory || [];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Overview of your asset management system</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              className="stat-card animate-in"
              key={card.key}
              style={{ '--card-accent': card.gradient }}
            >
              <div className="stat-card-header">
                <div className="stat-card-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                  <Icon />
                </div>
              </div>
              <div className="stat-card-label">{card.label}</div>
              <div className="stat-card-value">{stats[card.key] ?? 0}</div>
            </div>
          );
        })}
      </div>

      <div className="table-container animate-in">
        <div className="table-header">
          <span className="table-title">Recent Activity</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Asset</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {recentHistory.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <div className="empty-state-text">No recent activity</div>
                    </div>
                  </td>
                </tr>
              ) : (
                recentHistory.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge badge-${item.action}`}>
                        {item.action}
                      </span>
                    </td>
                    <td>{item.asset?.name || '—'} <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({item.asset?.asset_code})</span></td>
                    <td>{item.employee?.name || '—'}</td>
                    <td>{item.action_date}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.remarks || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
