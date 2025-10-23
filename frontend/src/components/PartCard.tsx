import Link from 'next/link';

export default function PartCard({ part }: any) {
  return (
    <div style={{ border:'1px solid #ddd', borderRadius:8, padding:12 }}>
      <h3>{part.name}</h3>
      <p>{part.brand} • {part.category}</p>
      <p>Price: ${part.price}</p>
      <p>Stock: {part.stock}</p>
      <Link href={`/parts/${part.id}`}><a>Details</a></Link>
    </div>
  );
}
