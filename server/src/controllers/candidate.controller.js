import CandidateProfile from "../models/CandidateProfile.js";

export const createProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      user: req.user._id,
    }).populate("user", "-password");

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};