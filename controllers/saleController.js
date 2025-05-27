import Sale from "../models/Sale.js";

//CRUD operations for Sale management
// Create a new sale(Only admin can create a sale)
export const addSale = async (req, res) => {
  try {
    const { name, description, discount, startTime, endTime } = req.body;

    // Check if a sale with the same name and overlapping time range already exists
    const existingSale = await Sale.findOne({
      name,
      $or: [
        { startTime: { $lte: endTime }, endTime: { $gte: startTime } }, // Overlapping time range
      ],
    });

    if (existingSale) {
      return res.status(400).json({
        message: "A sale with the same name or overlapping time range already exists.",
      });
    }

    const sale = new Sale({
      name,
      description,
      discount,
      startTime,
      endTime,
      createdBy: req.user._id,
    });

    await sale.save();
    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (error) {
    res.status(500).json({ message: "Error creating sale", error });
  }
};

// Get all sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

//Update a sale by ID
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, discount, startTime, endTime } = req.body;

    const sale = await Sale.findByIdAndUpdate(
      id,
      { name, description, discount, startTime, endTime },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ message: "Sale updated successfully", sale });
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error });
  }
};

// Delete a sale by ID
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findByIdAndDelete(id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error });
  }
};
