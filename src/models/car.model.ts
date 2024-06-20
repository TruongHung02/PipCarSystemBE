import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
type TObjectId = mongoose.Types.ObjectId;

export type TCar = {
  agency_id: TObjectId;
  plates: string;
  type: string;
  name: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;
  isAssign: boolean;
};

const carSchema = new mongoose.Schema<TCar>(
  {
    agency_id: { type: ObjectId, ref: 'Agency' },
    plates: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    updated_gps_time: { type: Number, required: true, default: 0 },
    isAssign: { type: Boolean, required: true, default: false},
  },
  {
    timestamps: true,
  },
);

const _Car = mongoose.model<TCar>('Car', carSchema);
export default _Car;
