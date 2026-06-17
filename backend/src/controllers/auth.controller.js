const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/pool');
const { JWT_SECRET } = require('../middleware/auth');

const ACCESS_TTL  = '8h';
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

function signAccess(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND active = true',
    [email.toLowerCase()]
  );
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const accessToken = signAccess(user);

  res.json({
    accessToken,
    user: {
      id: user.id, firstName: user.first_name, lastName: user.last_name,
      email: user.email, role: user.role,
    }
  });
};

exports.me = async (req, res) => {
  res.json({
    id: req.user.id, firstName: req.user.first_name, lastName: req.user.last_name,
    email: req.user.email, role: req.user.role,
  });
};

exports.logout = (_req, res) => res.json({ ok: true });
