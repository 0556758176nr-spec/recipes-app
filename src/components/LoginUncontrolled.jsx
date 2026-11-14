import { useActionState, useId } from 'react';
import { useNavigate } from 'react-router'
import { login } from '../services/auth';

/*
  שאלה מהתרגיל: האם אפשר לבדוק תקינות בזמן הקלדה?
  תשובה: עם form action לבדו - לא. ה-action רץ רק בשליחת הטופס,
  ולכן הבדיקה מתבצעת רק אז. כדי לבדוק תוך כדי הקלדה צריך להוסיף
  onChange לכל שדה (ואז בפועל כבר עוברים לטיפול דומה לטופס מבוקר).
*/

const initialState = {
  values: { email: 'chef@recipes.com', password: '' },
  errors: {},
};

export default function LoginUncontrolled() {
  const id = useId();
  const navigate = useNavigate();

  function loginAction(prevState, formData) {
    const values = Object.fromEntries(formData); 
    const errors = {};

    if (!values.email) {
      errors.email = 'אימייל הוא שדה חובה';
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = 'כתובת האימייל אינה תקינה';
    }

    if (!values.password) {
      errors.password = 'סיסמא היא שדה חובה';
    } else if (values.password.length < 6) {
      errors.password = 'הסיסמא חייבת להכיל לפחות 6 תווים';
    }

    if (Object.keys(errors).length > 0) {
      return { values, errors };
    }

    const user = login(values);
    if (!user) {
      return { values, errors: { general: 'אימייל או סיסמא שגויים' } };
    }

    navigate('/recipes');
    return { values, errors: {} };
  }

  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction}>
      <h2>התחברות (טופס לא מבוקר)</h2>

      <div>
        <label htmlFor={`${id}-email`}>אימייל</label>
        <input
          id={`${id}-email`}
          name="email"
          defaultValue={state.values.email}
        />
        {state.errors.email && <p className="error">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor={`${id}-password`}>סיסמא</label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          defaultValue={state.values.password}
        />
        {state.errors.password && (
          <p className="error">{state.errors.password}</p>
        )}
      </div>

      {state.errors.general && <p className="error">{state.errors.general}</p>}

      <button type="submit">התחברי</button>
    </form>
  );
}