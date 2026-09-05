import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  slug: { type: String, unique: true, index: true },
});

categorySchema.pre("save", async function (next) {
  if (!this.isModified("name") && this.slug) {
    return next();
  }

  const base = slugify(this.name);
  let candidate = base;
  let suffix = 1;
  while (
    await this.constructor.findOne({
      slug: candidate,
      _id: { $ne: this._id },
    })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  this.slug = candidate;
  next();
});

export default mongoose.model("Category", categorySchema);
