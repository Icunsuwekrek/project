const nodemailer = require("nodemailer");
const { format } = require("date-fns");
const { id } = require("date-fns/locale");

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Fungsi kirim email
const sendMail = async (to, subject, text, html) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

// Fungsi template email reservasi
const templateReserv = async (reservation) => {
  const reservedAt = format(
    new Date(reservation.reserved_at),
    "dd MMMM yyyy, HH:mm",
    { locale: id }
  );
  const scheduleAt = format(
    new Date(reservation.class.schedule),
    "dd MMMM yyyy, HH:mm",
    { locale: id }
  );

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4CAF50;">Konfirmasi Reservasi Kelas</h2>
      <p>Halo <strong>${reservation.user.name}</strong>,</p>

      <p>Berikut adalah detail reservasi kelas Anda:</p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px;">📅 <strong>Jadwal Kelas:</strong></td>
          <td style="padding: 8px;">${scheduleAt}</td>
        </tr>
        <tr>
          <td style="padding: 8px;">🏷️ <strong>Nama Kelas:</strong></td>
          <td style="padding: 8px;">${reservation.class.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px;">📍 <strong>Lokasi:</strong></td>
          <td style="padding: 8px;">${reservation.class.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px;">🧑‍🏫 <strong>Trainer:</strong></td>
          <td style="padding: 8px;">${reservation.class.trainer_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px;">📖 <strong>Deskripsi:</strong></td>
          <td style="padding: 8px;">${reservation.class.description}</td>
        </tr>
        <tr>
          <td style="padding: 8px;">🕒 <strong>Waktu Reservasi:</strong></td>
          <td style="padding: 8px;">${reservedAt}</td>
        </tr>
      </table>

      <p>📞 <strong>Kontak Anda:</strong> ${reservation.user.phone}</p>
      <p>📧 <strong>Email:</strong> ${reservation.user.email}</p>

      <p>Terima kasih telah melakukan reservasi. Sampai jumpa di kelas!</p>

      <hr />
      <p style="font-size: 12px; color: #888;">Email ini dikirim otomatis oleh sistem. Harap tidak membalas email ini.</p>
    </div>
  `;
};

module.exports = {
  sendMail,
  templateReserv,
};
