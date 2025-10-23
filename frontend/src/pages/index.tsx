import { GetServerSideProps } from 'next';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { Slider } from '@mui/material';

interface Part {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
}

interface Props {
  initialParts: Part[];
  totalPages: number;
}

export default function Home({ initialParts, totalPages }: Props) {
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(totalPages);

  // ✅ Updated: Send priceRange to API
  const fetchParts = async (pageNum = 1) => {
    try {
      const res = await api.get('/parts', {
        params: {
          page: pageNum,
          limit: 4,
          q: search,
          category: categoryFilter !== 'all' ? categoryFilter : '',
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        },
      });

      setParts(res.data.data);
      setPages(res.data.meta.totalPages);
      setPage(res.data.meta.page);
    } catch (err) {
      console.error('Error fetching parts:', err);
    }
  };

  // ✅ Include priceRange in the effect dependency list
  useEffect(() => {
    fetchParts(page);
  }, [search, categoryFilter, priceRange, page]);

  const categories = useMemo(() => {
    const all = initialParts.map((p) => p.category);
    return ['all', ...Array.from(new Set(all))];
  }, [initialParts]);

  const pageNumbers = useMemo(() => {
    const nums = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    return nums;
  }, [pages]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Auto Parts Inventory</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>

        {/* <div className={styles.priceRange}>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            min={0}
            className={styles.priceInput}
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            min={priceRange[0]}
            className={styles.priceInput}
          />
        </div> */}
        <div className={styles.priceRange}>
  <label className={styles.priceLabel}>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
  <Slider
    value={priceRange}
    onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
    onChangeCommitted={() => fetchParts(1)} // fetch after user releases the slider
    valueLabelDisplay="auto"
    min={5}
    max={1500}
    step={10}
    sx={{
      color: '#1976d2',
      width: '250px',
      marginTop: '10px'
    }}
  />
</div>
      </div>

      {/* Parts Grid */}
      <div className={styles.grid}>
        {parts.length > 0 ? (
          parts.map((part) => (
            <div key={part.id} className={styles.card}>
              {part.image_url && <img src={part.image_url} alt={part.name} className={styles.image} />}
              <h3>
                <Link href={`/parts/${part.id}`} className={styles.partLink}>
                  {part.name}
                </Link>
              </h3>
              <p><strong>Brand:</strong> {part.brand}</p>
              <p><strong>Category:</strong> {part.category}</p>
              <p><strong>Price:</strong> ${part.price}</p>
              <p><strong>Stock:</strong> {part.stock}</p>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No parts found matching your criteria.</p>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={styles.pageButton}
          >
            &laquo; Prev
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              className={`${styles.pageButton} ${num === page ? styles.activePage : ''}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            disabled={page === pages}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts?page=1&limit=10`);
  const json = await res.json();

  return {
    props: {
      initialParts: json.data || [],
      totalPages: json.meta?.totalPages || 1,
    },
  };
};
