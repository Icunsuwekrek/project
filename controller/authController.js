const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Password salah' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login berhasil',
      token,
      // role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
