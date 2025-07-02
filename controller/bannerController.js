const prisma = require("../prisma/client");
const dateFnsTz = require("date-fns-tz");

const utcToZonedTime = dateFnsTz.toZonedTime;
const format = dateFnsTz.format;


exports.getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany();

    const timeZone = "Asia/Jakarta";

    const bannersWithLocalTime = banners.map((banner) => {
      return {
        ...banner,
        created_at: banner.created_at
          ? format(
              utcToZonedTime(banner.created_at, timeZone),
              "yyyy-MM-dd HH:mm:ss",
              { timeZone }
            )
          : null,
        updated_at: banner.updated_at
          ? format(
              utcToZonedTime(banner.updated_at, timeZone),
              "yyyy-MM-dd HH:mm:ss",
              { timeZone }
            )
          : null,
      };
    });

    res.status(200).json({
      message: "Success ambil data banners",
      data: bannersWithLocalTime,
    });
  } catch (error) {
    console.error("Error Get Banners:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.createBanner = async (req, res) => {
  try {
    const { title, link, is_active } = req.body;
    const file = req.file; // ambil file dari multer

    // Validasi sederhana
    if (!file || !title) {
      return res
        .status(400)
        .json({ message: "File gambar dan title wajib diisi." });
    }

    // Buat path URL file yang akan disimpan
    const image_url = `/public/uploads/${file.filename}`;

    const newBanner = await prisma.banner.create({
      data: {
        image_url,
        title,
        link: link || null,
        is_active: is_active !== undefined ? is_active === "true" : true, // convert string ke boolean
      },
    });

    res.status(201).json({
      message: "Banner berhasil dibuat",
      data: newBanner,
    });
  } catch (error) {
    console.error("Error Create Banner:", error);
    res.status(500).json({ error: error.message });
  }
};

  