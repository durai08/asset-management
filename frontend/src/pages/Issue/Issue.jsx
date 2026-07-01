import { useState, useEffect } from 'react';
import { HiOutlineArrowCircleRight } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getIssues, issueAsset } from '../../services/issueService';
import { getAssets } from '../../services/assetService';
import { getEmployees } from '../../services/employeeService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

const emptyForm = { asset_id: '', employee_id: '', issue_date: new Date().toISOString().split('T')[0], expected_return_date: '', remarks: '' };

export default function Issue() {
  const [issues, setIssues] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [issuesRes, assetsRes, empsRes] = await Promise.all([
        getIssues(), getAssets(), getEmployees(),
      ]);
      setIssues(issuesRes.data);
      setAssets(assetsRes.data);
      setEmployees(empsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const availableAssets = assets.filter(a => a.status === 'available');
  const activeEmployees = employees.filter(e => e.is_active);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await issueAsset(form);
      toast.success('Asset issued successfully');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Issue failed');
    }
  };

  const columns = [
    { key: 'asset', label: 'Asset', accessor: (r) => r.asset?.name || '—', render: (r) => <><strong>{r.asset?.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({r.asset?.asset_code})</span></> },
    { key: 'employee', label: 'Issued To', accessor: (r) => r.employee?.name || '—', render: (r) => <><strong>{r.employee?.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({r.employee?.emp_code})</span></> },
    { key: 'issue_date', label: 'Issue Date', accessor: 'issue_date' },
    { key: 'expected_return_date', label: 'Expected Return', accessor: 'expected_return_date', render: (r) => r.expected_return_date || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    {
      key: 'status', label: 'Status', accessor: 'status',
      render: (r) => <span className={`badge badge-${r.status}`}>{r.status}</span>,
    },
    { key: 'remarks', label: 'Remarks', accessor: 'remarks', render: (r) => r.remarks || <span style={{ color: 'var(--text-muted)' }}>—</span> },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Issue Asset</h1>
          <p>Issue assets to employees</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ ...emptyForm, issue_date: new Date().toISOString().split('T')[0] }); setModalOpen(true); }}>
          <HiOutlineArrowCircleRight /> Issue Asset
        </button>
      </div>

      <Table
        title={`All Issues (${issues.length})`}
        columns={columns}
        data={issues}
        emptyMessage="No issues found"
        emptyIcon="📋"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue Asset"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Issue</button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Asset *</label>
            <select className="form-select" required value={form.asset_id} onChange={e => setForm({ ...form, asset_id: e.target.value })}>
              <option value="">Choose an available asset...</option>
              {availableAssets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.asset_code})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Issue To Employee *</label>
            <select className="form-select" required value={form.employee_id} onChange={e => setForm({ ...form, employee_id: e.target.value })}>
              <option value="">Choose an employee...</option>
              {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.emp_code})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Issue Date *</label>
              <input className="form-input" type="date" required value={form.issue_date} onChange={e => setForm({ ...form, issue_date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Return Date</label>
              <input className="form-input" type="date" value={form.expected_return_date} onChange={e => setForm({ ...form, expected_return_date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea className="form-textarea" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Optional notes..." />
          </div>
        </form>
      </Modal>
    </div>
  );
}
