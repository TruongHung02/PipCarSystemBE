import mongoose from 'mongoose';
import _Agency from '../models/agency.model';
import _Car, { TCar } from '../models/car.model';

type TObjectId = mongoose.Types.ObjectId;

export const CarsSeeder = async (agency_id: TObjectId): Promise<TObjectId[]> => {
  const query = new RegExp('PipCar', 'i');
  await _Car
    .deleteMany({ name: query })
    .then(() => {
      console.log('PipCar Car is Cleared');
    })
    .catch((error) => {
      console.log(error);
    });
  const data: TCar[] = [
    {
      agency_id,
      name: 'PipCar Toyota',
      plates: '29A-98799',
      type: '5seats',
      lat: '21.00383',
      long: '105.83916',
      updated_gps_time: 0,
      isAssign: false,
    },
  ];

  let newCarIds: TObjectId[] = [];

  data.forEach(async (item) => {
    const newCar = new _Car(item);
    newCarIds.push(newCar.toObject()._id);
    await newCar.save();
  });

  await _Agency.findByIdAndUpdate(
    agency_id.toString(),
    { hasCar: data.length },
    { new: true, omitUndefined: true },
  );

  console.log(`${data.length} PipCar Car is Seeded`);

  return newCarIds;
};
