import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../lib/api';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import styles from '@/styles/LoginForm.module.css';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof schema>;

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { login, isLoggedIn, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [loading, isLoggedIn, router]);

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.token);
      router.push('/dashboard'); // Redirect immediately after login
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  if (loading) return <p>Loading...</p>; // optional: show while checking token

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label className={styles.formGroupLabel}>Email</label>
          <input {...register('email')} className={styles.input} />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formGroupLabel}>Password</label>
          <input type="password" {...register('password')} className={styles.input} />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <div className={styles.redirect}>
        Not a member? <a href="/register">Register here</a>
      </div>
    </div>
  );
}
