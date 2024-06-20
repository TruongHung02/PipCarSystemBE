import { BadRequestError, DataNotFoundError } from '@pippip/pip-system-common';
import { Request, Response } from 'express';
import _Agency from '../models/agency.model';
import _Car from '../models/car.model';
import _Driver from '../models/driver.model';
import { convertToNumber, getTotalPage } from '../utils';

/**
 * [ADMIN,PM] createCar
 */
export const createCar = async (req: Request, res: Response): Promise<void> => {
  const { agency: agencyId } = req.query;
  const { plates, type, name, lat, long, updated_gps_time } = req.body;

  const foundAgency = await _Agency.findById(agencyId);
  if (!foundAgency) throw new DataNotFoundError();

  const newCar = new _Car({
    agency_id: null,
    plates,
    type,
    name,
    lat,
    long,
    updated_gps_time,
  });

  newCar.agency_id = foundAgency._id;

  const newCarRes = await newCar.save();

  if (!newCarRes) throw new BadRequestError('Something went wrong');

  await _Agency.findByIdAndUpdate(
    agencyId,
    { $inc: { hasCar: 1 } },
    { new: true, omitUndefined: true },
  );

  res.status(200).json({
    status: 1,
    message: 'Create Car Successfully.',
    data: { new_car: newCar },
  });
};

/**
 * [ADMIN,PM] getCarList
 * TODO:
 * [x] - Phân trang, Tìm kiếm
 * [x] - Bộ lọc
 * [] - Sắp xếp
 */
export const getCarList = async (req: Request, res: Response): Promise<void> => {
  const { agency: agencyId, keyword, page, limit, isDriven, sort } = req.query; // => all string | undefined
  let filter: any = {};

  if (!!agencyId) filter.agency_id = agencyId;

  if (!!keyword) {
    const regex = new RegExp(`${keyword}`, 'i');
    const regexCond = { $regex: regex };
    console.log(regexCond);
    filter['$or'] = [{ name: regexCond }, { type: regexCond }];
  }

  if (!!isDriven) {
    const foundDriverDrivingList = await _Driver.find({ car_id: { ['$ne']: null } });
    const mappedCarIds = foundDriverDrivingList.map(({ car_id }) => car_id);
    if (isDriven === 'true') filter['_id'] = { ['$in']: mappedCarIds };
    if (isDriven === 'false') filter['_id'] = { ['$nin']: mappedCarIds };
  }

  const currentPage = convertToNumber(page) || 1;

  const limitNumber = convertToNumber(limit) || 10;

  const totalRegister = await _Car.countDocuments(filter);

  const foundCarList = await _Car
    .find(filter)
    .skip((currentPage - 1) * limitNumber)
    .limit(limitNumber)
    .sort([
      ['status', 1],
      ['updatedAt', -1],
    ]);

  res.status(200).json({
    status: 1,
    message: 'Get Car List Successfully.',
    data: {
      car_list: foundCarList,
      meta_data: {
        page: currentPage,
        limit: limitNumber,
        total: totalRegister,
        totalPage: getTotalPage(totalRegister, limitNumber),
      },
    },
  });
};

/**
 * [ADMIN,PM] getCarDetail
 */
export const getCarDetail = async (req: Request, res: Response): Promise<void> => {
  const { carId } = req.params;
  const foundCar = await _Car.findById(carId);
  const foundDriver = await _Driver.findOne({ car_id: carId });
  res.status(200).json({
    status: 1,
    message: 'Get Car Profile Successfully.',
    data: {
      car_detail: foundCar,
      driver_detail: foundDriver,
    },
  });
};

/**
 * [ADMIN, PM] updateCarDetail
 */
export const updateCarDetail = async (req: Request, res: Response): Promise<void> => {
  const { carId } = req.params;
  const { plates, type, name, lat, long, updated_gps_time } = req.body;
  const updatedCar = await _Car.findByIdAndUpdate(
    carId,
    { plates, type, name, lat, long, updated_gps_time },
    {
      new: true,
      omitUndefined: true,
    },
  );
  res.status(200).json({
    status: 1,
    message: 'Update Car Successfully.',
    data: { car_detail: updatedCar },
  });
};

/**
 * [ADMIN, PM] deleteCar
 */
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  const { carId } = req.params;
  const deletedCar = await _Car.findByIdAndDelete(carId);

  if (!deletedCar) throw new DataNotFoundError();

  await Promise.all([
    _Agency.findByIdAndUpdate(
      deletedCar.agency_id,
      { $inc: { hasCar: -1 } },
      { new: true, omitUndefined: true },
    ),
    _Driver.findOneAndUpdate(deletedCar._id, { car_id: null }, { new: true, omitUndefined: true }),
  ]);

  res.status(200).json({
    status: 1,
    message: 'Delete Car Successfully.',
    data: { car_detail: deletedCar },
  });
};

/**
 * [ADMIN,PM] unDeliverCar
 */
export const unDeliverCar = async (req: Request, res: Response): Promise<void> => {
  const { carId } = req.params;

  const updatedDriver = await _Driver.findOneAndUpdate(
    { car_id: carId },
    { car_id: null },
    { new: true, omitUndefined: true },
  );
  res.status(200).json({
    status: 1,
    message: 'unDeliver Driver Successfully.',
    data: { driver_detail: updatedDriver },
  });
};
