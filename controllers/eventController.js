const Event = require('../models/Event');
const transporter = require('../config/emailConfig');
const path = require("path");


//create
const createEvent = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);     console.log("Incoming file:", req.file);

    const {
      eventName,
      agenda,
      venue,
      location,
      chiefGuest,
      date,
    } = req.body;

    if (
      !eventName || !agenda || !venue || !location ||
      !chiefGuest || !date
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hndls uploded img path
const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({
      eventName,
      agenda,
      venue,
      location,
      chiefGuest,
      date,
      image, // Save just the filename or full path
      status: 'Invited',
    });

    await newEvent.save();
    console.log("Event saved to DB");

    res.status(201).json({ message: 'Event created & invitations sent', event: newEvent });

  } catch (error) {
    console.error("Error in createEvent:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//get all Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};
//update
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const {
      eventName,
      agenda,
      venue,
      location,
      chiefGuest,
      date,
    } = req.body;

    const updateData = {
      eventName,
      agenda,
      venue,
      location,
      chiefGuest,
      date,
    };

    //If a nw img was uplded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

    res.json(updatedEvent);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

//delte
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

//share
const shareEvent = async (req, res) => {
  try {
    const { participants, eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
   //evnt dtls to include in mail
    const { eventName, agenda, venue, location, chiefGuest, date, image } = event;

    const imagePath = image ? path.join(__dirname, "..", image.replace(/^\/+/, '')) : null;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: participants,
      subject: `Invitation: ${eventName}`,
      html: `
        <h2>${eventName}</h2>
        <p><strong>Agenda:</strong> ${agenda}</p>
        <p><strong>Venue:</strong> ${venue}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Chief Guest:</strong> ${chiefGuest}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
        ${image ? `<img src="cid:eventImage" alt="Event Image" style="max-width:100%;"/>` : ""}
        <br/><br/>
        <a
    style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px; display: inline-block;"
    href="#"
    onclick="return false;"
  >
    Interested
  </a>
  &nbsp;
  <a
    style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px; display: inline-block;"
    href="#"
    onclick="return false;"
  >
    Not Interested
  </a>
      `,
      attachments: image
        ? [
            {
              filename: path.basename(image),
              path: imagePath,
              cid: "eventImage",  //attachs d image
            },
          ]
        : [],
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
};


module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  shareEvent,
};
