const prisma = require("../prisma/client");
const dateFnsTz = require("date-fns-tz");

const utcToZonedTime = dateFnsTz.toZonedTime;
const format = dateFnsTz.format;


exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();

    const timeZone = "Asia/Jakarta";

    const eventsWithLocalTime = events.map((event) => {
      const formattedEvent = { ...event };

      if (event.event_date) {
        const zonedEventDate = utcToZonedTime(event.event_date, timeZone);
        formattedEvent.event_date = format(
          zonedEventDate,
          "yyyy-MM-dd HH:mm:ss",
          { timeZone }
        );
      }

      if (event.created_at) {
        const zonedCreatedAt = utcToZonedTime(event.created_at, timeZone);
        formattedEvent.created_at = format(
          zonedCreatedAt,
          "yyyy-MM-dd HH:mm:ss",
          { timeZone }
        );
      }

      if (event.updated_at) {
        const zonedUpdatedAt = utcToZonedTime(event.updated_at, timeZone);
        formattedEvent.updated_at = format(
          zonedUpdatedAt,
          "yyyy-MM-dd HH:mm:ss",
          { timeZone }
        );
      }

      return formattedEvent;
    });

    res.status(200).json({
      message: "success ambil data event",
      data: eventsWithLocalTime,
    });
  } catch (error) {
    console.error("Error Get Events:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({
        message: 'Field "title" dan "event_date" wajib diisi.',
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        event_date: new Date(event_date),
        location,
      },
    });

    res.status(201).json({
      message: "Event berhasil dibuat",
      data: newEvent,
    });
  } catch (error) {
    console.error("Error Create Event:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date, location, is_active, link } =
    req.body;

  try {
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (link !== undefined) updateData.link = link;

    if (event_date !== undefined) {
      const timeZone = "Asia/Jakarta";
      const zonedEventDate = utcToZonedTime(new Date(event_date), timeZone);
      updateData.event_date = new Date(zonedEventDate);
    }

    // Selalu update updated_at
    updateData.updated_at = new Date();

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Berhasil update event",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error update event:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek dulu apakah event dengan id tersebut ada
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!event) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    // Hapus event
    await prisma.event.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Event berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus event:", error);
    res.status(500).json({ error: error.message });
  }
};