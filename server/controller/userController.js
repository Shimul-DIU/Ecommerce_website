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
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const fullname =
      typeof body.fullname === "string" ? body.fullname.trim() : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";

    if (fullname.length < 2 || fullname.length > 100 || phone.length > 20) {
      return res.status(400).json({ message: "Invalid profile details" });
    }

    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullname = fullname;
    user.phone = phone;
    await user.save();

    return res.status(200).json({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

const getUserAddresses = async (userId) => {
  const user = await Users.findById(userId).select("addresses");
  return user;
};

export const getAddresses = async (req, res) => {
  try {
    const user = await getUserAddresses(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Address Fetch Error:", error);
    return res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

const parseAddress = (body = {}) => {
  const { label, line, city, phone } = body || {};
  const isDefault = Boolean(body?.isDefault);
  if (
    [label, line, city, phone].some(
      (value) => typeof value !== "string" || !value.trim()
    )
    || label.trim().length > 40
    || line.trim().length > 200
    || city.trim().length > 80
    || phone.trim().length > 20
  ) {
    return null;
  }

  return {
    label: label.trim(),
    line: line.trim(),
    city: city.trim(),
    phone: phone.trim(),
    isDefault,
  };
};

export const addAddress = async (req, res) => {
  try {
    const address = parseAddress(req.body);
    if (!address) {
      return res.status(400).json({ message: "Complete all address fields" });
    }

    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    address.isDefault = address.isDefault || user.addresses.length === 0;
    if (address.isDefault) {
      user.addresses.forEach((savedAddress) => {
        savedAddress.isDefault = false;
      });
    }
    user.addresses.push(address);
    await user.save();

    return res.status(201).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Address Create Error:", error);
    return res.status(500).json({ message: "Failed to save address" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = parseAddress(req.body);
    if (!address) {
      return res.status(400).json({ message: "Complete all address fields" });
    }

    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedAddress = user.addresses.id(req.params.addressId);
    if (!savedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }
    savedAddress.set(address);
    await user.save();

    return res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Address Update Error:", error);
    return res.status(500).json({ message: "Failed to update address" });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();

    return res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Address Delete Error:", error);
    return res.status(500).json({ message: "Failed to delete address" });
  }
};