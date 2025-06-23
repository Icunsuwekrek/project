const prisma = require("../prisma/client")
const dateFnsTz = require("date-fns-tz");

const utcToZonedTime = dateFnsTz.toZonedTime;
const format = dateFnsTz.format;


const crypto = require("crypto");

exports.createTicket = async (req, res) => {
  try {
    const {
      issue_title,
      description,
      assigned_to,
      created_by,
      status, // optional: default "open"
    } = req.body;

    // Validasi field wajib
    if (!issue_title || !description || !created_by) {
      return res.status(400).json({
        message: "issue_title, description, dan created_by wajib diisi.",
      });
    }

    // Generate ticket_number: TCK-YYYYMMDD-RND
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase(); // contoh: AB12
    const ticket_number = `TCK-${datePart}-${randomPart}`;

    const newTicket = await prisma.ticket.create({
      data: {
        ticket_number,
        issue_title,
        description,
        assigned_to: assigned_to || null,
        created_by,
        status: status || "open",
      },
    });

    return res.status(201).json({
      message: "Berhasil membuat tiket",
      data: newTicket,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat membuat tiket",
      error: error.message,
    });
  }
};



exports.getTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      sort_by = "id",
      sort_type = "desc",
    } = req.query;

    const allowedLimits = [25, 50, 1000];
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    if (!allowedLimits.includes(parsedLimit)) {
      return res.status(400).json({
        message: "Limit hanya boleh 25, 50, atau 1000",
      });
    }

    const tickets = await prisma.ticket.findMany({
      skip,
      take: parsedLimit,
      orderBy: {
        [sort_by]: sort_type.toLowerCase() === "asc" ? "asc" : "desc",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const total = await prisma.ticket.count();

    const timeZone = "Asia/Jakarta";

    const ticketsWithLocalTime = tickets.map((ticket) => {
      const createdAtZoned = utcToZonedTime(ticket.created_at, timeZone);
      const updatedAtZoned = utcToZonedTime(ticket.updated_at, timeZone);

      return {
        ...ticket,
        created_at: format(createdAtZoned, "yyyy-MM-dd HH:mm:ss", { timeZone }),
        updated_at: format(updatedAtZoned, "yyyy-MM-dd HH:mm:ss", { timeZone }),
      };
    });

    res.status(200).json({
      message: "Berhasil mengambil semua tiket",
      data: ticketsWithLocalTime,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        total_pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    console.error("Error Get Tickets:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil tiket",
      error: error.message,
    });
  }
};



exports.updateTicket = async (req, res) => {
  const { id } = req.params; // ambil id ticket dari params
  const { status } = req.body; // ambil status baru dari body

  if (!status) {
    return res.status(400).json({ message: "Status wajib diisi" });
  }

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        status,
        updated_at: new Date(), // set waktu update otomatis
      },
    });

    res.status(200).json({
      message: "Berhasil update status tiket",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat update tiket",
      error: error.message,
    });
  }
};

exports.deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek apakah tiket dengan ID tersebut ada
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTicket) {
      return res.status(404).json({
        message: "Tiket tidak ditemukan",
      });
    }

    // Hapus tiket
    await prisma.ticket.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: "Tiket berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat menghapus tiket",
      error: error.message,
    });
  }
};
  
  
  
  
