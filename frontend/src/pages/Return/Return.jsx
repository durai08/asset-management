import { useState, useEffect } from 'react';
import { HiOutlineArrowCircleLeft } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getIssuedForReturn, returnAsset } from '../../services/issueService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

export default function Return() {
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ actual_return_date: new Date().toISOString().split('T')[0], remarks: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getIssuedForReturn();
      setIssued(res.data);
    } catch (err) {
      toast.error('Failed to load issued assets');
    } finally {
      setLoading(false);
    }
  };

  const openReturn = (item) => {
    setSelected(item);
    setForm({ actual_return_date: new Date().toISOString().split('T')[0], remarks: '' });
    setModalOpen(true);
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      await returnAsset(selected.id, form);
      toast.success('Asset returned successfully');
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed');
    }
  };

  const columns = [
    { key: 'asset', label: 'Asset', accessor: (r) => r.asset?.name || '—', render: (r) => <><strong>{r.asset?.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({r.asset?.asset_code})</span></> },
    { key: 'employee', label: 'Issued To', accessor: (r) => r.employee?.name || '—', render: (r) => <><strong>{r.employee?.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({r.employee?.emp_code})</span></> },
    { key: 'issue_date', label: 'Issue Date', accessor: 'issue_date' },
    { key: 'expected_return_date', label: 'Expected Return', accessor: 'expected_return_date', render: (r) => r.expected_return_date || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'remarks', label: 'Remarks', accessor: 'remarks', render: (r) => r.remarks || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    {
      key: 'actions', label: 'Action', noSort: true,
      render: (r) => (
        <button className="btn btn-sm btn-success" onClick={() => openReturn(r)}>
          <HiOutlineArrowCircleLeft /> Return
        </button>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Return Asset</h1>
          <p>Return issued assets back to inventory</p>
        </div>
      </div>

      <Table
        title={`Currently Issued (${issued.length})`}
        columns={columns}
        data={issued}
        emptyMessage="No assets currently issued"
        emptyIcon="✅"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Return Asset"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-success" onClick={handleReturn}>Confirm Return</button>
          </>
        }
      >
        {selected && (
          <form onSubmit={handleReturn}>
            <div style={{ marginBottom: 18, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Returning</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-heading)' }}>{selected.asset?.name} ({selected.asset?.asset_code})</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Issued to: {selected.employee?.name}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Return Date *</label>
              <input className="form-input" type="date" required value={form.actual_return_date} onChange={e => setForm({ ...form, actual_return_date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea className="form-textarea" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Any notes about the return..." />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
