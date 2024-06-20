import mongoose from 'mongoose';
import _Driver, { TDriver } from '../models/driver.model';

export const DriverSeeder = async (
  agency_id: mongoose.Types.ObjectId,
  car_id: mongoose.Types.ObjectId,
): Promise<void> => {
  const query = new RegExp('PipCar', 'i');
  await _Driver
    .deleteMany({ name: query })
    .then(() => {
      console.log('PipCar Driver is Cleared');
    })
    .catch((error) => {
      console.log(error);
    });
  const data: TDriver[] = [
    {
      agency_id,
      car_id,
      phone: '0965670347',
      license_id: '0965670347',
      name: 'PipCar Driver',

      status: 1,
      rank: 0,

      address: 'Nhà B1, Đại học Bách Khoa Hà Nội',
      lat_address: '21.00383',
      long_address: '105.83916',
      lat: '21.00383',
      long: '105.83916',
      updated_gps_time: 0,
    },
  ];

  data.forEach(async (item) => {
    await new _Driver(item).save();
  });

  console.log(`${data.length} PipCar Driver is Seeded`);
};
