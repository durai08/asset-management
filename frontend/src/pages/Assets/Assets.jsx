import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineBan } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getAssets, createAsset, updateAsset, deleteAsset, scrapAsset } from '../../services/assetService';
import { getCategories } from '../../services/categoryService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

const emptyForm = { asset_code: '', name: '', category_id: '', serial_number: '', purchase_date: '', purchase_cost: '', condition: 'Good' };

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [assetsRes, catsRes] = await Promise.all([getAssets(), getCategories()]);
      setAssets(assetsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      asset_code: a.asset_code, name: a.name, category_id: a.category_id || '',
      serial_number: a.serial_number || '', purchase_date: a.purchase_date || '',
      purchase_cost: a.purchase_cost || '', condition: a.condition || 'Good',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, category_id: form.category_id || null, purchase_cost: form.purchase_cost || null };
      if (editing) {
        await updateAsset(editing.id, data);
        toast.success('Asset updated');
      } else {
        await createAsset(data);
        toast.success('Asset created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset?')) return;
    try {
      await deleteAsset(id);
      toast.success('Asset deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleScrap = async (id) => {
    const remarks = window.prompt('Reason for scrapping:');
    if (remarks === null) return;
    try {
      await scrapAsset(id, { remarks });
      toast.success('Asset scrapped');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Scrap failed');
    }
  };

  const columns = [
    { key: 'asset_code', label: 'Code', accessor: 'asset_code' },
    { key: 'name', label: 'Name', accessor: 'name' },
    { key: 'category', label: 'Category', accessor: (r) => r.category?.name || '—' },
    { key: 'serial_number', label: 'Serial No.', accessor: 'serial_number' },
    { key: 'purchase_date', label: 'Purchase Date', accessor: 'purchase_date' },
    { key: 'purchase_cost', label: 'Cost', render: (r) => r.purchase_cost ? `₹${Number(r.purchase_cost).toLocaleString()}` : '—' },
    { key: 'condition', label: 'Condition', accessor: 'condition' },
    {
      key: 'status', label: 'Status', noSort: false, accessor: 'status',
      render: (r) => <span className={`badge badge-${r.status}`}>{r.status}</span>,
    },
    {
      key: 'actions', label: 'Actions', noSort: true,
      render: (r) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-icon" onClick={() => openEdit(r)} title="Edit"><HiOutlinePencil /></button>
          {r.status === 'available' && (
            <button className="btn-icon danger" onClick={() => handleScrap(r.id)} title="Scrap"><HiOutlineBan /></button>
          )}
          <button className="btn-icon danger" onClick={() => handleDelete(r.id)} title="Delete"><HiOutlineTrash /></button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Assets</h1>
          <p>Manage your organization's assets</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus /> Add Asset
        </button>
      </div>

      <Table
        title={`All Assets (${assets.length})`}
        columns={columns}
        data={assets}
        emptyMessage="No assets found"
        emptyIcon="📦"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Asset' : 'Add Asset'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Asset Code *</label>
              <input className="form-input" required value={form.asset_code} onChange={e => setForm({ ...form, asset_code: e.target.value })} placeholder="AST-001" />
            </div>
            <div className="form-group">
              <label className="form-label">Asset Name *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dell Laptop" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input className="form-input" value={form.serial_number} onChange={e => setForm({ ...form, serial_number: e.target.value })} placeholder="SN-12345678" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Purchase Date</label>
              <input className="form-input" type="date" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Cost (₹)</label>
              <input className="form-input" type="number" step="0.01" value={form.purchase_cost} onChange={e => setForm({ ...form, purchase_cost: e.target.value })} placeholder="50000" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Condition</label>
            <select className="form-select" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="New">New</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
