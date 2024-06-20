import { BadRequestError, DataNotFoundError } from '@pippip/pip-system-common';
import { Request, Response } from 'express';
import _Agency from '../models/agency.model';
import _Register, { TRegister } from '../models/register.model';
import _Car from '../models/car.model';
import { convertToNumber, getRandomInt, getTotalPage } from '../utils';
import { createDriver } from './driver.controllers';

/**
 * [ADMIN,PM] getAgencyList
 * TODO:
 * [x] - Phân trang, Tìm kiếm
 * [] - Bộ lọc (status, ....)
 * [] - Sắp xếp
 */
export const getAgencyList = async (req: Request, res: Response): Promise<void> => {
  const { status, keyword, page, limit, isTransportation, isDriver, hasCar, sort } = req.query; // => all string
  let filter: any = {};

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    const regex = new RegExp(`${keyword}`, 'i');
    const regexCond = { $regex: regex };
    console.log(regexCond);
    filter['$or'] = [{ name: regexCond }, { phone: regexCond }];
  }

  if (isTransportation) {
    filter.isTransportation = isTransportation;
  }

  if (isDriver) {
    filter.isDriver = isDriver;
  }

  if (hasCar) {
    filter.hasCar = { $gte: convertToNumber(hasCar) };
  }

  const currentPage = convertToNumber(page) || 1;

  const limitNumber = convertToNumber(limit) || 10;

  const totalAgency = await _Agency.countDocuments(filter);

  const foundAgencyList = await _Agency
    .find(filter)
    .skip((currentPage - 1) * limitNumber)
    .limit(limitNumber)
    .sort([
      ['status', 1],
      ['updatedAt', -1],
    ]);

  res.status(200).json({
    status: 1,
    message: 'Get Agency List Successfully.',
    data: {
      agency_list: foundAgencyList,
      meta_data: {
        page: currentPage,
        limit: limitNumber,
        total: totalAgency,
        totalPage: getTotalPage(totalAgency, limitNumber),
      },
    },
  });
};

/**
 * [ADMIN,PM] getAgencyDetail
 */
export const getAgencyDetail = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  const foundAgency = await _Agency.findById(agencyId);
  res.status(200).json({
    status: 1,
    message: 'Get Agency Profile Successfully.',
    data: {
      agency_detail: foundAgency,
    },
  });
};

/**
 * [ADMIN,PM] updateAgencyDetail
 */
export const updateAgencyDetail = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  // const {name,phone,address,isDriver,isTransportation,lat,lat_address,long,long_address,point,rank,updated_gps_time,status} = req.body;
  const {
    hasCar,
    refresh_token,
    code,
    phone,
    name,
    address,
    isDriver,
    isTransportation,
    lat,
    lat_address,
    long,
    long_address,
    point,
    rank,
    status,
    updated_gps_time,
    imgURL,
  } = req.body;

  const foundAgency = await _Agency.findById(agencyId);
  if (!foundAgency) throw new DataNotFoundError();

  let newData = {
    code,
    phone,
    name,
    address,
    isDriver,
    isTransportation,
    lat,
    lat_address,
    long,
    long_address,
    point,
    rank,
    status,
    updated_gps_time,
    imgURL,
  };
  if (!!code && foundAgency.code !== code) {
    newData.code = code;
    const updatedAgency = await _Agency.findByIdAndUpdate(
      agencyId,
      { ...newData, refresh_token: 'EMPTY' },
      {
        new: true,
        omitUndefined: true,
      },
    );
  } else {
    const updatedAgency = await _Agency.findByIdAndUpdate(agencyId, newData, {
      new: true,
      omitUndefined: true,
    });
  }

  res.status(200).json({
    status: 1,
    message: 'Update Agency Profile Successfully.',
  });
};

/**
 * [ADMIN,PM] createAgency
 */
export const createAgency = async (req: Request, res: Response): Promise<void> => {
  const generatedCode = getRandomInt().toString();
  const {
    code,
    name,
    phone,
    address,
    isDriver,
    isTransportation,
    lat,
    lat_address,
    long,
    long_address,
    point,
    rank,
    updated_gps_time,
    imgURL,
  } = req.body;

  const foundAgency = await _Agency.findOne({ phone });
  if (!!foundAgency) throw new BadRequestError('This account is already registered');

  const registerData: TRegister = {
    code: generatedCode,
    phone,
    name,
    status: 1,
    isAgency: true,
    isDriver,
    isTransportation,
  };
  const foundRegister = await _Register.findOne({ phone });
  if (!foundRegister) {
    await new _Register(registerData).save();
  } else {
    await _Register.findOneAndUpdate({ phone }, registerData, { new: true, omitUndefined: true });
  }

  
  
  const newAgency = new _Agency({
    code: generatedCode,
    name,
    phone,
    address,
    isDriver,
    isTransportation,
    lat,
    lat_address,
    long,
    long_address,
    point,
    rank,
    updated_gps_time,
    imgURL,
  });
  newAgency.save();
  res.status(200).json({
    status: 1,
    message: 'New agency created',
    data: {
      "agency_id" : newAgency._id,
    }
  });
};

/**
 * [ADMIN,PM] blockAgency
 */
export const blockAgency = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  const updatedAgency = await _Agency.findByIdAndUpdate(
    agencyId,
    { status: 2, refresh_token: 'EMPTY' },
    { new: true },
  );
  res.status(200).json({
    status: 1,
    message: 'Block Agency Successfully.',
  });
};

/**
 * [ADMIN,PM] unblockAgency
 */
export const unblockAgency = async (req: Request, res: Response): Promise<void> => {
  const { agencyId } = req.params;
  const updatedAgency = await _Agency.findByIdAndUpdate(agencyId, { status: 1 }, { new: true });
  res.status(200).json({
    status: 1,
    message: 'Unblock Agency Successfully.',
  });
};
