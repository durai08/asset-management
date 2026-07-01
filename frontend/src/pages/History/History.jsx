import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getHistory } from '../../services/historyService';
import Table from '../../components/Table';
import Loader from '../../components/Loader';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { load(); }, [filter]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.action = filter;
      const res = await getHistory(params);
      setHistory(res.data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'action', label: 'Action', accessor: 'action',
      render: (r) => <span className={`badge badge-${r.action}`}>{r.action}</span>,
    },
    { key: 'asset', label: 'Asset', accessor: (r) => r.asset?.name || '—', render: (r) => <><strong>{r.asset?.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({r.asset?.asset_code})</span></> },
    { key: 'employee', label: 'Employee', accessor: (r) => r.employee?.name || '—', render: (r) => r.employee ? <><strong>{r.employee.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({r.employee.emp_code})</span></> : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'action_date', label: 'Date', accessor: 'action_date' },
    { key: 'remarks', label: 'Remarks', accessor: 'remarks', render: (r) => r.remarks || <span style={{ color: 'var(--text-muted)' }}>—</span> },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>History</h1>
          <p>Complete audit trail of asset transactions</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['', 'issued', 'returned', 'scrapped'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f || 'All'}
            </button>
          ))}
        </div>
      </div>

      <Table
        title={`History (${history.length} records)`}
        columns={columns}
        data={history}
        emptyMessage="No history records found"
        emptyIcon="📜"
      />
    </div>
  );
}
