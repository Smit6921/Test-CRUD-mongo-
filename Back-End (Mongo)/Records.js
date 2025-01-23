const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8000;


const recordSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
});

const Record = mongoose.model('Record', recordSchema);

// Get all Records
app.get("/record", async (req, res) => {
  try {
    const records = await Record.find();
    res.json({ lists: records });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// Create Record
app.post("/record", async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json({
      msg: "Your Record is Added Successfully!",
      task: savedRecord,
    });
  } catch (err) {
    res.status(400).json({ msg: 'Bad Request', error: err.message });
  }
});

// Get a single Record
app.get("/record/:record_id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.record_id);
    if (!record) {
      return res.status(404).json({ msg: "Record does not exist" });
    }
    res.status(200).json({ record });
  } catch (err) {
    res.status(400).json({ msg: 'Bad Request', error: err.message });
  }
});

// Update Record
app.patch("/record/:record_id", async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.record_id, req.body, { new: true });
    if (!record) {
      return res.status(404).json({ msg: "Record does not exist" });
    }
    res.status(200).json({
      msg: "Record has been updated successfully",
      updatedRecord: record,
    });
  } catch (err) {
    res.status(400).json({ msg: 'Bad Request', error: err.message });
  }
});

// Delete Record
app.delete("/record/:record_id", async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.record_id);
    if (!record) {
      return res.status(404).json({ msg: "Record does not exist" });
    }
    res.status(200).json({ msg: "Record is removed successfully." });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

app.listen(PORT, async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/record")
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection error:", err));
  console.log(`Server is running on http://localhost:${PORT}`);
});
