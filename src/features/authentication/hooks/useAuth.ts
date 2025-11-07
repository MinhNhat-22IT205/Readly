import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function useAuthForm() {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
}
