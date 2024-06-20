import mongoose from 'mongoose';
import _Agency, { TAgency } from '../models/agency.model';
import _Register from '../models/register.model';
import { TRegister } from './../models/register.model';
import { getRandomInt } from './../utils';

type TObjectId = mongoose.Types.ObjectId;

export const AgencySeeder = async (): Promise<TObjectId> => {
  const query = new RegExp('PipCar', 'i');
  await _Agency
    .deleteMany({ name: query })
    .then(() => {
      console.log('PipCar Agency is Cleared');
    })
    .catch((error) => {
      console.log(error);
    });
  await _Register
    .deleteMany({ name: query })
    .then(() => {
      console.log('PipCar Register is Cleared');
    })
    .catch((error) => {
      console.log(error);
    });
  const newCode = getRandomInt().toString();
  const data: TAgency = {
    phone: '0965670347',
    name: 'PipCar Agency',
    code: newCode,

    isTransportation: true,
    isDriver: true,
    status: 1,
    hasCar: 1,

    rank: 0,
    point: 1000,

    address: 'Nhà B1, Đại học Bách Khoa Hà Nội',
    lat_address: '21.00383',
    long_address: '105.83916',
    lat: '21.00383',
    long: '105.83916',
    updated_gps_time: 0,

    refresh_token: 'EMPTY',
  };
  const newRegisterData: TRegister = {
    phone: '0965670347',
    name: 'PipCar Agency',
    code: newCode,
    isAgency: true,
    isTransportation: true,
    isDriver: true,
    status: 1,
  };

  const newRegister = new _Register(newRegisterData);
  await newRegister.save();
  const newAgency = new _Agency(data);
  await newAgency.save();

  console.log('PipCar Agency is Seeded');
  return newAgency.toObject()._id;
};
