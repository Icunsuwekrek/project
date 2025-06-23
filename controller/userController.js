const prisma = require('../prisma/client');
const { sendMail } = require('../utils/mailer'); 
const safeJson = require('../utils/safeJson');
const bcrypt = require('bcrypt');
const accountCreatedEmail = require('../emails/accountCreatedEmail');
const fs = require('fs');
const path = require('path');

// Get all users
exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // default 10 per halaman
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      data: safeJson(users),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Int(req.params.id) },
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
    let resolvedRole = '';

    if (role === '2') {
      resolvedRole = 'user';
      plainPassword = Math.random().toString(36).slice(-10);
      finalPassword = await bcrypt.hash(plainPassword, 10);
    } else if (role === '1') {
      resolvedRole = 'admin';
      if (!password || password.length > 20) {
        return res.status(400).json({ error: 'Password untuk admin wajib diisi dan maksimal 20 karakter.' });
      }
      plainPassword = password;
      finalPassword = await bcrypt.hash(password, 10);
    } else {
      return res.status(400).json({ error: 'Role tidak valid. Gunakan 1 (admin) atau 2 (user).' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email sudah digunakan' });
    }

    const profilePath = req.file ? req.file.filename : null;
    const userId = req.user?.id;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: finalPassword,
        role: resolvedRole,
        profile: profilePath,
        created_at: new Date(),
        updated_at: null,
        created_by: userId,
      },
    });

    // Kirim email (tanpa menghentikan proses kalau gagal)
    const mail = accountCreatedEmail({
      name,
      email,
      password: plainPassword,
    });

    try {
      await sendMail(email, mail.subject, mail.text, mail.html);
    } catch (err) {
      console.error('Gagal kirim email:', err.message);
    }

    return res.status(201).json({ message: 'User berhasil dibuat', user });

  } catch (err) {
    return res.status(500).json({ error: 'Terjadi kesalahan saat membuat user' });
  }
};




// Update user
exports.updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, phone, role } = req.body;

  // 🔒 Cek apakah user adalah admin atau dirinya sendiri
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Kamu tidak punya akses untuk update user ini' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    let newProfile = existingUser.profile;

    // 🔁 Ganti profile jika ada file baru
    if (req.file) {
      const oldPath = path.join(__dirname, '..', existingUser.profile || '');
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      newProfile = `/uploads/${req.file.filename}`;
    }

    const updateData = {
      name: name || undefined,
      phone: phone || undefined,
      profile: newProfile,
      updated_at: new Date(),
    };

    // Hanya admin yang boleh update role
    if (req.user.role === 'admin' && role) {
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Int(req.params.id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};