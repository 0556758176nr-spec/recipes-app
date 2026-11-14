import Joi from 'joi';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'אימייל הוא שדה חובה',
      'string.email': 'כתובת האימייל אינה תקינה',
      'any.required': 'אימייל הוא שדה חובה',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'סיסמא היא שדה חובה',
      'string.min': 'הסיסמא חייבת להכיל לפחות 6 תווים',
      'any.required': 'סיסמא היא שדה חובה',
    }),
});

export default function LoginRhf() {
  const id = useId();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: 'chef@recipes.com', password: '' },
  });

  function onSubmit(data) {
    const user = login(data);
    if (!user) {
      setError('root', { message: 'אימייל או סיסמא שגויים' });
      return;
    }
    navigate('/recipes');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>התחברות (react-hook-form)</h2>

      <div>
        <label htmlFor={`${id}-email`}>אימייל</label>
        <input id={`${id}-email`} {...register('email')} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor={`${id}-password`}>סיסמא</label>
        <input id={`${id}-password`} type="password" {...register('password')} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      {errors.root && <p className="error">{errors.root.message}</p>}

      <button type="submit">התחברי</button>
    </form>
  );
}