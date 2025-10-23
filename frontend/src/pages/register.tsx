import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Form.module.css';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: RegisterInput) => {
    try {
      await api.post('/auth/register', data);
      router.push('/login'); // redirect to login after successful registration
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formGroupLabel}>Name</label>
          <input type="text" {...register('name')} className={styles.input} />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formGroupLabel}>Email</label>
          <input type="email" {...register('email')} className={styles.input} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formGroupLabel}>Password</label>
          <input type="password" {...register('password')} className={styles.input} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <button type="submit" className={styles.button}>Register</button>

        <p className={styles.redirect}>
          Already a member? <Link href="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
