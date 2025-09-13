'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth/context';
import { registerSchema, type RegisterFormData } from '../../../lib/auth/validation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registrationData } = data;
      await registerUser(registrationData);
      
      router.push('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message) {
        if (Array.isArray(err.message)) {
          setError(err.message.join(', '));
        } else {
          setError(err.message);
        }
      } else if (err.statusCode === 409) {
        setError('User with this email or username already exists');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Username"
              type="text"
              autoComplete="username"
              required
              {...register('username')}
              error={errors.username?.message}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First name (optional)"
                type="text"
                autoComplete="given-name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />

              <Input
                label="Last name (optional)"
                type="text"
                autoComplete="family-name"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Create account
          </Button>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}