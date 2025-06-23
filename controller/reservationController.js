const prisma = require("../prisma/client");
const { sendMail, templateReserv } = require("../utils/mailer");

exports.createReservation = async (req, res) => {
  const { user_id, class_id } = req.body;

  try {
    const reservation = await prisma.reservations.create({
      data: {
        user_id: Number(user_id),
        class_id: Number(class_id),
        reserved_at: new Date(),
      },
      include: {
        user: true,
        class: true,
      },
    });

    // Buat isi HTML email dari helper
    const htmlTemplate = await templateReserv(reservation);

    // Kirim email ke user yang reservasi
    await sendMail(
      reservation.user.email, // diambil dari relasi
      "Konfirmasi Reservasi Kelas",
      "Reservasi Anda berhasil dibuat.",
      htmlTemplate
    );

    res.status(201).json({
      message: "Reservasi berhasil dibuat dan email dikirim.",
      data: reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservations.findMany({
      include: {
        user: true,
        class: true,
      },
    });

    res.status(200).json({
      message: "Berhasil mengambil data reservations",
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.reservations.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: "Berhasil menghapus reservation",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
