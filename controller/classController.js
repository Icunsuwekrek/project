const prisma = require("../prisma/client");
const dateFnsTz = require("date-fns-tz");

const utcToZonedTime = dateFnsTz.toZonedTime;
const format = dateFnsTz.format;



exports.getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany();

    const classesWithLocalTime = classes.map((cls) => {
      if (!cls.schedule) return cls;
      const timeZone = "Asia/Jakarta";
      const zonedDate = utcToZonedTime(cls.schedule, timeZone);
      return {
        ...cls,
        schedule: format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone }),
      };
    });

    res.status(200).json({
      message: "success ambil data class",
      data: classesWithLocalTime,
    });
  } catch (error) {
    console.error("Error Get Classes:", error)
    res.status(500).json({ error: error.message });
  }
};
  

  exports.updateClass = async (req, res) => {
    const { id } = req.params; // ambil id dari params
    const { name, schedule, quota, location, trainer_name, description } =
      req.body;

    try {
      const updatedClass = await prisma.Class.update({
        where: { id: Number(id) },
        data: {
          name,
          schedule,
          quota,
          location,
          trainer_name,
          description,
          updated_at: new Date(),
        },
      });

      res.status(200).json({
        message: "Success update class",
        data: updatedClass,
      });
    } catch (error) {
        consoler.error("error update classes:", error)
      res.status(500).json({ error: error.message });
    }
  };
  
  
  exports.createClass = async (req, res) => {
    const { name, schedule, quota, location, trainer_name, description } =
      req.body;

    try {
        const scheduleDate = schedule
          ? new Date(schedule.replace(" ", "T"))
          : null;

      const newClass = await prisma.Class.create({
        data: {
          name,
          schedule: scheduleDate, // langsung pakai string dari req.body, biar prisma yang handle konversinya
          quota,
          location,
          trainer_name,
          description,
        },
      });

      res.status(201).json({
        message: "berhasil menambahkan class",
        data: newClass,
      });
    } catch (err) {
        console.error('error create class:', Error)
      res.status(400).json({ error: err.message });
    }
  };
  exports.deleteClass = async (req, res) => {
    const { id } = req.params;

    try {
      // Cek dulu apakah class dengan ID tersebut ada
      const existingClass = await prisma.class.findUnique({
        where: { id: Number(id) },
      });

      if (!existingClass) {
        return res.status(404).json({ error: "Class tidak ditemukan" });
      }

      // Hapus class
      await prisma.class.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: "Class berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  
