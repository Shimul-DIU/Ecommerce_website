import Users from "../model/userModel.js";


export const getProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role:user.role

      },
    });
  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};