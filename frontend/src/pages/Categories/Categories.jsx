import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

const emptyForm = { name: '', description: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error('Delete failed — category may have assets');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', accessor: 'name' },
    { key: 'description', label: 'Description', accessor: 'description', render: (row) => row.description || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    {
      key: 'actions', label: 'Actions', noSort: true,
      render: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-icon" onClick={() => openEdit(row)} title="Edit"><HiOutlinePencil /></button>
          <button className="btn-icon danger" onClick={() => handleDelete(row.id)} title="Delete"><HiOutlineTrash /></button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Categories</h1>
          <p>Manage asset categories</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus /> Add Category
        </button>
      </div>

      <Table
        title={`All Categories (${categories.length})`}
        columns={columns}
        data={categories}
        emptyMessage="No categories found"
        emptyIcon="🏷️"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Laptops" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Category description..." />
          </div>
        </form>
      </Modal>
    </div>
  );
}
