import mongoose from 'mongoose';

const formSchemaDef = new mongoose.Schema({
  type: { type: String, required: true, unique: true },
  fields: { type: Array, default: [] }
});

export const FormSchema = mongoose.model('FormSchema', formSchemaDef);
