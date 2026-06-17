import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export default function AdminProfile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('La nueva contraseña y su confirmación no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setSuccess('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-topbar__title">MI CUENTA</div>
      </div>
      <div className="admin-content">
        <div style={{ maxWidth: 420 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: 13, color: '#777' }}>
              {user?.email} · {user?.role === 'admin' ? 'Administrador' : 'Vendedor'}
            </div>
          </div>

          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Cambiar contraseña
          </h2>

          {error   && <div className="login-error" style={{ marginBottom: 12 }}>{error}</div>}
          {success && (
            <div style={{
              background: '#eafaf0',
              border: '1px solid #b7e4c7',
              color: '#1e7a44',
              fontFamily: 'Roboto, sans-serif',
              fontSize: 13,
              padding: '10px 14px',
              marginBottom: 12,
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <input
              className="form-input"
              type="password"
              placeholder="Nueva contraseña (mín. 8 caracteres)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={{ marginTop: 10 }}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={{ marginTop: 10 }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              {loading ? 'GUARDANDO...' : 'ACTUALIZAR CONTRASEÑA'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
