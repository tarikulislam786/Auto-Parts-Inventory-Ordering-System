// src/pages/parts/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import styles from '@/styles/PartDetail.module.css';

export default function PartPage({ part }: any) {
  if (!part) return <div className={styles.notFound}>Part not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Show image if available */}
        {part.image_url ? (
          <img
            src={part.image_url}
            alt={part.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>No Image</div>
        )}

        <div className={styles.info}>
          <h1>{part.name}</h1>
          <p><strong>Brand:</strong> {part.brand}</p>
          <p><strong>Category:</strong> {part.category}</p>
          <p><strong>Price:</strong> ${part.price}</p>
          <p><strong>Stock:</strong> {part.stock}</p>
        </div>
      </div>

      <Link href="/" className={styles.backLink}>← Back to Home</Link>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts`);
  const json = await res.json();
  const parts = json.data || json;
  const paths = parts.map((p: any) => ({ params: { id: String(p.id) } }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${id}`);
  if (res.status === 404) return { notFound: true };

  const part = await res.json();
  return { props: { part }, revalidate: 60 };
};
