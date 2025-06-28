import Address from "../models/Adress.js";
import User from "../models/User.js";

// Get all addresses of the logged-in user
export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.findAll({
      where: { userId },
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};

// Create or Update address
export const upsertAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      id,
      fullName,
      phone,
      city,
      street,
      postalCode,
      isDefault = false,
    } = req.body;

    // Check if it's an update
    if (id) {
      const existing = await Address.findOne({ where: { id, userId } });
      if (!existing) {
        return res.status(404).json({ message: "Address not found for update" });
      }
      if (isDefault) {
        await Address.update({ isDefault: false }, { where: { userId } });
      }
      existing.fullName = fullName;
      existing.phone = phone;
      existing.city = city;
      existing.street = street;
      existing.postalCode = postalCode;
      existing.isDefault = isDefault;
      
      await existing.save();
      const user = await User.findByPk(userId, { attributes: ["id", "name"] });

      return res.status(200).json({
        message: "Address updated",
        address: { ...existing.toJSON(), user },
      });
    }

    // Create case
    const existingCount = await Address.count({ where: { userId } });
    const finalIsDefault = existingCount === 0 ? true : isDefault;

    if (finalIsDefault) {
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    const newAddress = await Address.create({
      userId,
      fullName,
      phone,
      city,
      street,
      postalCode,
      isDefault: finalIsDefault,
    });

    const user = await User.findByPk(userId, { attributes: ["id", "name"] });

    res.status(200).json({
      message: "Address saved",
      address: { ...newAddress.toJSON(), user },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save address", error });
  }
};

// Set a specific address as default
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOne({ where: { id: addressId, userId } });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.update({ isDefault: false }, { where: { userId } });
    address.isDefault = true;
    await address.save();

    res.status(200).json({ message: "Default address updated", address });
  } catch (error) {
    res.status(500).json({ message: "Failed to set default address", error });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOne({ where: { id: addressId, userId } });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await address.destroy();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error });
  }
};
