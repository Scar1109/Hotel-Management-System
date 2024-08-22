const express = require("express");
const router = express.Router();

const packageModel = require("../models/Package");

// Function to generate a unique package ID
const generatePackageId = async () => {
      const lastPackage = await packageModel.findOne().sort({ packageId: -1 });
      if (!lastPackage) {
            return "PKG0001"; // Starting ID
      }

      const lastIdNumber = parseInt(
            lastPackage.packageId.replace("PKG", ""),
            10
      );
      const newIdNumber = lastIdNumber + 1;
      return `PKG${newIdNumber.toString().padStart(4, "0")}`;
};

// Get all packages
router.get("/getPackages", async (req, res) => {
      try {
            const packages = await packageModel.find();
            res.json({ packages });
      } catch (err) {
            res.status(500).json({ message: "Failed to fetch packages" });
      }
});

// Add new package
router.post("/addPackage", async (req, res) => {
      const packageId = await generatePackageId();
      const { packageName, description, price } = req.body;

      try {
            // Check if a package with the same name already exists
            const existingPackage = await packageModel.findOne({ packageName });
            if (existingPackage) {
                  return res
                        .status(400)
                        .json({
                              message: "Package with this name already exists",
                        });
            }

            // Create a new package if it doesn't exist
            const newPackage = new packageModel({
                  packageId,
                  packageName,
                  description,
                  price,
            });
            const savedPackage = await newPackage.save();
            res.status(201).json(savedPackage);
      } catch (error) {
            res.status(400).json({ message: error.message });
      }
});

// Update package
router.put("/updatePackage/:id", async (req, res) => {
      try {
            const { packageName } = req.body;
            // Check if another package with the same name exists (excluding the current package)
            const existingPackage = await packageModel.findOne({
                  packageName,
                  _id: { $ne: req.params.id },
            });
            if (existingPackage) {
                  return res
                        .status(400)
                        .json({
                              message: "Package with this name already exists",
                        });
            }

            await packageModel.findByIdAndUpdate(req.params.id, req.body);
            res.json({ message: "Package updated successfully" });
      } catch (err) {
            res.status(500).json({ message: "Failed to update package" });
      }
});

// Delete package
router.delete("/deletePackage/:id", async (req, res) => {
      try {
            await packageModel.findByIdAndDelete(req.params.id);
            res.json({ message: "Package deleted successfully" });
      } catch (err) {
            res.status(500).json({ message: "Failed to delete package" });
      }
});

module.exports = router;
