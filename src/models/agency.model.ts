import mongoose from 'mongoose';

export type TAgency = {
  phone: string;
  name: string;

  isTransportation?: boolean;
  isDriver?: boolean;
  status?: number;
  hasCar?: number;

  rank?: number;
  point?: number;

  address?: string;
  lat_address?: string;
  long_address?: string;
  lat?: string;
  long?: string;
  updated_gps_time?: number;

  refresh_token?: string;
  code: string;

  imgURL?: string;
};

const agencySchema = new mongoose.Schema<TAgency>(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    isTransportation: { type: Boolean, require: true, default: false },
    isDriver: { type: Boolean, require: true, default: false },
    status: { type: Number, required: true, default: 0 },
    hasCar: { type: Number, required: true, default: 0 },

    rank: { type: Number, required: true, default: 0 },
    point: { type: Number, required: true, default: 1000 },

    address: { type: String, required: true },
    lat_address: { type: String, required: true },
    long_address: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    updated_gps_time: { type: Number, required: true, default: 0 },

    imgURL: { type: String, require : false },

    code: { type: String, required: true, min: 6 },
    refresh_token: { type: String, default: 'EMPTY' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refresh_token;
      },
    },
  },
);

const _Agency = mongoose.model<TAgency>('Agency', agencySchema);
export default _Agency;
