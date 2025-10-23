import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import api from '../lib/api';
import styles from '@/styles/Dashboard.module.css';

type Part = {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
};

export default function Dashboard() {
  const { token, isLoggedIn, logout, loading } = useAuth();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [stats, setStats] = useState({ total: 0, categories: 0 });

const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const itemsPerPage = 3; // Dashboard shows 3 items per page


  const [modalVisible, setModalVisible] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<any>();

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push('/login');
  }, [loading, isLoggedIn]);

  const fetchParts = async (pageNum = 1) => {
    try {
      const res = await api.get('/parts', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageNum,
          limit: itemsPerPage,
        },
      });
  
      setParts(res.data.data);
      setStats({
        total: res.data.meta?.total || res.data.data.length,
        categories: new Set(res.data.data.map((p: Part) => p.category)).size,
      });
      setPage(res.data.meta.page);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (isLoggedIn) fetchParts(page);
  }, [isLoggedIn, page]);
  

  // Image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setPreview(null);
    }
  };

  const openAddModal = () => {
    setEditingPart(null);
    setPreview(null);
    reset();
    setModalVisible(true);
  };

  const openEditModal = (part: Part) => {
    setEditingPart(part);
    setValue('name', part.name);
    setValue('brand', part.brand);
    setValue('price', part.price);
    setValue('stock', part.stock);
    setValue('category', part.category);
    setPreview(part.image_url || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPart(null);
    setPreview(null);
    reset();
  };

  // ✅ Cancel edit
  const onCancel = () => {
    setEditingPart(null);
    setPreview(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]: any) => {
        if (key !== 'image') formData.append(key, value);
      });
      const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) formData.append('image', fileInput.files[0]);

      if (editingPart) {
        // Update
        await api.put(`/parts/${editingPart.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Add
        await api.post('/parts', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }

      closeModal();
      fetchParts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving part');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Delete this part?')) return;
    try {
      await api.delete(`/parts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchParts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting part');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={() => { logout(); router.push('/'); }} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.stats}>
        <p>Total parts: <strong>{stats.total}</strong></p>
        <p>Categories: <strong>{stats.categories}</strong></p>
      </div>

      <button onClick={openAddModal} className={styles.addNewButton}>Add New Part</button>

      {/* Modal */}
      {modalVisible && (
        <div className={styles.modalOverlay} onClick={() => setModalVisible(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => setModalVisible(false)}>
                X
          </button>
            <h2>{editingPart ? 'Edit Part' : 'Add New Part'}</h2>
<form onSubmit={handleSubmit(onSubmit)} className={styles.form} encType="multipart/form-data">
  <div className={styles.formRow}>
    {/* Left: Input Fields */}
    <div className={styles.formCol}>
      <input type="text" placeholder="Name" {...register('name')} required />
      <input type="text" placeholder="Brand" {...register('brand')} />
      <input type="number" step="0.01" placeholder="Price" {...register('price')} required />
      <input type="number" placeholder="Stock" {...register('stock')} required />
      <input type="text" placeholder="Category" {...register('category')} />
      <input
        type="file"
        accept="image/*"
        {...register('image')}
        onChange={handleImageChange}
      />

      <div className={styles.formActions}>
        <button type="submit" className={styles.addButton}>
          {editingPart ? 'Update Part' : 'Add Part'}
        </button>
        {editingPart && (
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>
    </div>
    <div className={styles.formCol}>
 {/* Right: Image Preview */}
 <div className={styles.previewCol}>
      {preview ? (
        <img src={preview} alt="Preview" className={styles.previewImage} />
      ) : (
        <p className={styles.noPreview}>No image selected</p>
      )}
    </div>
    </div>
  </div>
 
</form>


          </div>
        </div>
      )}

      {/* Parts List */}
      <div className={styles.partsList}>
        {parts.map(p => (
          <div key={p.id} className={styles.partCard}>
            {p.image_url && <img src={p.image_url} alt={p.name} className={styles.partImage} />}
            <div className={styles.partInfo}>
              <strong>{p.name}</strong> - {p.brand || '-'} - ${p.price} - Stock: {p.stock} - Category: {p.category}
            </div>
            <div className={styles.partActions}>
              <button onClick={() => openEditModal(p)}>Edit</button>
              <button onClick={() => onDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
  <div className={styles.pagination}>
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className={styles.pageButton}
    >
      &laquo; Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
      <button
        key={num}
        className={`${styles.pageButton} ${num === page ? styles.activePage : ''}`}
        onClick={() => setPage(num)}
      >
        {num}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className={styles.pageButton}
    >
      Next &raquo;
    </button>
  </div>
)}

    </div>
  );
}
