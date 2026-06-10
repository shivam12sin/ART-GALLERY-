import Inquiry from "../models/Inquiry.js";

export async function createInquiry(req, res, next) {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({
      inquiry,
      message: "Thanks for contacting the gallery. We will respond soon."
    });
  } catch (error) {
    next(error);
  }
}

export async function getInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find().sort("-createdAt").populate("artwork", "title");
    res.json({ inquiries });
  } catch (error) {
    next(error);
  }
}
