module.exports = function accountCreatedEmail({ name, email, password }) {
  return {
    subject: '🎉 Yeay! Akun Kamu Sudah Siap Digunakan',
    text: `Hai ${name},

Akun kamu berhasil dibuat 🎉

Email: ${email}
Password: ${password}

Langsung login dan jangan lupa ganti password-nya ya! 🚀`,
    html: `
      <div style="max-width: 500px; margin: auto; font-family: 'Segoe UI', sans-serif; background: #f9f9f9; padding: 30px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4f46e5;">✨ Welcome, ${name}!</h2>
          <p style="font-size: 16px; color: #555;">Akun kamu berhasil dibuat 🎉</p>
        </div>
        <div style="background: #fff; padding: 20px; border-radius: 10px; border: 1px solid #eee;">
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>🔑 Password:</strong> ${password}</p>
        </div>
        <p style="margin-top: 20px;">Langsung login sekarang dan jangan lupa ganti password-mu ya! 💪</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://yourapp.com/login" style="background: #4f46e5; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Login Sekarang</a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
          Email ini dikirim secara otomatis. Jika kamu tidak merasa membuat akun, abaikan saja ya!
        </p>
      </div>
    `,
  };
};
