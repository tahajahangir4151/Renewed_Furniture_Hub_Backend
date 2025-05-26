import Banner from "../models/Banner.js";

// GET /api/carousel/slides
export const getCarouselSlides = async (req, res) => {
  try {
    const slides = await Banner.find({ active: true }).sort({ createdAt: -1 });
    // Map to frontend expected structure (no hardcoded fields)
    const mappedSlides = slides.map((slide) => ({
      id: slide._id,
      image: slide.imageUrl,
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      brand: slide.brand,
      buttonText: slide.buttonText,
      category: slide.category,
      price: slide.price,
      originalPrice: slide.originalPrice,
      link: slide.link,
    }));
    res.status(200).json(mappedSlides);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch carousel slides", error: error.message });
  }
};

// POST /api/carousel (admin only, with image upload)
export const createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      brand,
      buttonText,
      category,
      price,
      originalPrice,
      link,
    } = req.body;
    let imageUrl = req.file && req.file.path ? req.file.path : "";
    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }
    const banner = new Banner({
      imageUrl,
      title,
      subtitle,
      description,
      brand,
      buttonText,
      category,
      price,
      originalPrice,
      link,
    });
    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Failed to create banner", error: error.message });
  }
};
