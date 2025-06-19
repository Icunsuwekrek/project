const prisma = require('../prisma/client');
const sendMail = require('../utils/mailer');
const safeJson = require('../utils/safeJson');
const bcrypt = require('bcrypt');

// Get all users
exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(safeJson(users));
};

// Get user by ID
exports.getUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(req.params.id) },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(safeJson(users));
};

// Create new user
exports.createUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    let plainPassword;
    let finalPassword;

    if (role === 'user') {
      plainPassword = Math.random().toString(36).slice(-10);
      finalPassword = await bcrypt.hash(plainPassword, 10);
    } else if (role === 'admin') {
      if (!password || password.length > 20) {
        return res.status(400).json({ error: 'Password untuk admin wajib diisi dan maksimal 20 karakter.' });
      }
      plainPassword = password;
      finalPassword = await bcrypt.hash(password, 10);
    } else {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    const existing = await prisma.user.findUnique({
  where: { email }
});

if (existing) {
  return res.status(400).json({ error: 'Email sudah digunakan' });
}

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: finalPassword,
        role,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Kirim email ke user
    await sendMail(
      email,
      "Akun Anda telah dibuat",
      `Halo ${name},\n\nAkun Anda berhasil dibuat.\n\nEmail: ${email}\nPassword: ${plainPassword}\n\nSilakan login dan segera ganti password.`
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Update user
exports.updateUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: BigInt(req.params.id) },
      data: {
        name,
        email,
        phone,
        password: password ? await bcrypt.hash(password, 10) : undefined,
        role,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: BigInt(req.params.id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};