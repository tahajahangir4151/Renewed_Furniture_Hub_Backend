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

// Add new address (with optional isDefault)
export const upsertAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            fullName,
            phone,
            city,
            street,
            postalCode,
            isDefault = false,
        } = req.body;

        // If setting this address as default, unset others
        if (isDefault) {
            await Address.update(
                { isDefault: false },
                { where: { userId } }
            );
        }

        const newAddress = await Address.create({
            userId,
            fullName,
            phone,
            city,
            street,
            postalCode,
            isDefault,
        });

        const user = await User.findByPk(userId, {
            attributes: ["id", "name"],
        });

        res.status(200).json({ message: "Address saved", address: { ...newAddress.toJSON(), user } });
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

        // Unset all other default addresses
        await Address.update({ isDefault: false }, { where: { userId } });

        // Set selected as default
        address.isDefault = true;
        await address.save();

        res.status(200).json({ message: "Default address updated", address });
    } catch (error) {
        res.status(500).json({ message: "Failed to set default address", error });
    }
};
