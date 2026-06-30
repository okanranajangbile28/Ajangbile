import moment, { Moment } from 'moment';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import { Model } from 'mongoose';
import { Document } from 'mongoose';
import { NewField, Period, PopOptions } from '../types';

export const deleteOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const createOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

export const getOne = <T extends Document>(
  Model: Model<T>,
  popOptions?: PopOptions,
) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',

      data: doc,
    });
  });

export const getAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };

    const features = new APIFeatures(
      Model.find(filter),
      req.query as Record<string, string>,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,

      data: doc,
    });
  });

export const getMine = <T extends Document>(Model: Model<T>) =>
  catchAsync<'auth'>(async (req, res) => {
    const data = await Model.find({
      user: req.user.id,
    });
    res.status(200).json({ status: 'success', results: data.length, data });
  });

const aggregator = async <T extends Document>(
  Model: Model<T>,
  start: Moment,
  stop: Moment,
  period: Period,
  time: 'day' | 'week' | 'month' | 'year' | 'custom',
  newField: NewField[],
) => {
  const groupFields: Record<string, any> = {
    _id: period[(time || 'daily') as keyof typeof period],
  };

  newField.forEach((property) => {
    groupFields[property.field] = { $sum: property.acc };
  });

  return await Model.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start.toDate(),
          $lte: stop.toDate(),
        },
        $or: [
          { orderStatus: { $exists: false } },
          { orderStatus: { $in: ['completed', 'pending'] } },
        ],
      },
    },
    {
      $addFields: {
        orderItems: {
          $ifNull: ['$orderItems', []],
        },
      },
    },
    {
      $group: groupFields,
    },
  ]);
};
export const getTotalModelPerTime = <T extends Document>(
  Model: Model<T>,
  newField: NewField[],
) =>
  catchAsync(async (req, res) => {
    const { startTime, endTime, time } = req.query as {
      startTime?: string;
      endTime?: string;
      time?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    };

    const period = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
      yearly: 'year',
    } as Period;

    let startOfPeriod: Moment;
    let endOfPeriod: Moment;

    if (startTime && endTime) {
      startOfPeriod = moment(startTime, 'YYYY-MM-DD');
      endOfPeriod = moment(endTime, 'YYYY-MM-DD');
    } else {
      startOfPeriod = moment().startOf(
        (period[time as keyof typeof period] ||
          'day') as moment.unitOfTime.StartOf,
      );
      endOfPeriod = moment().endOf(
        (period[time as keyof typeof period] ||
          'day') as moment.unitOfTime.StartOf,
      );
    }

    const totalAmount = await aggregator(
      Model,
      startOfPeriod,
      endOfPeriod,
      period,
      time as Period[keyof typeof period] | 'custom',
      newField,
    );
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    res.status(200).json({ ...totalAmount[0] });
  });

export const percentageChangeModel = <T extends Document>(
  Model: Model<T>,
  newField: NewField[],
) =>
  catchAsync(async (req, res) => {
    let customTimeStart = moment(
      req.query.customTimeStart?.toString(),
      'DD/MM/YYYY',
    );
    let customTimeEnd = moment(req.query.customTimeEnd?.toString());

    let currentTimeStart: moment.Moment;
    let currentTimeEnd: moment.Moment;
    let previousTimeStart: moment.Moment;
    let previousTimeEnd: moment.Moment;
    let totalDays: number;

    const timeRange = {
      custom: 'custom',
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
      yearly: 'year',
    } as Period;

    if (req.query.time !== 'custom') {
      currentTimeStart = moment().startOf(
        (timeRange[req.query.time as keyof typeof timeRange] ||
          'day') as moment.unitOfTime.StartOf,
      );
      currentTimeEnd = moment().endOf(
        (timeRange[req.query.time as keyof typeof timeRange] ||
          'day') as moment.unitOfTime.StartOf,
      );
      previousTimeStart = moment()
        .startOf(
          (timeRange[req.query.time as keyof typeof timeRange] ||
            'day') as moment.unitOfTime.StartOf,
        )
        .subtract(
          1,
          (timeRange[req.query.time as keyof typeof timeRange] ||
            'day') as moment.unitOfTime.DurationConstructor,
        );
      previousTimeEnd = moment()
        .endOf(
          (timeRange[req.query.time as keyof typeof timeRange] ||
            'day') as moment.unitOfTime.StartOf,
        )
        .subtract(
          1,
          (timeRange[req.query.time as keyof typeof timeRange] ||
            'day') as moment.unitOfTime.DurationConstructor,
        );
    } else {
      customTimeStart = moment(customTimeStart, 'DD/MM/YYYY');
      customTimeEnd = moment(customTimeEnd, 'DD/MM/YYYY');
      currentTimeStart = customTimeStart;
      currentTimeEnd = customTimeEnd;
      totalDays = currentTimeEnd.diff(currentTimeStart, 'days', true);
      previousTimeStart = customTimeStart.clone().subtract(totalDays, 'days');
      previousTimeEnd = customTimeStart.clone();
    }

    const currentTime = await aggregator(
      Model,
      currentTimeStart,
      currentTimeEnd,
      timeRange,
      req.query.time as 'day' | 'week' | 'month' | 'year' | 'custom',
      newField,
    );

    const previousTime = await aggregator(
      Model,
      previousTimeStart,
      previousTimeEnd,
      timeRange,
      req.query.time as 'day' | 'week' | 'month' | 'year' | 'custom',
      newField,
    );
    let percentageDifference = 0;
    let totalCurrentTime = 0;
    let totalPreviousTime = 0;
    const stats = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < newField.length; i++) {
      if (currentTime[0]) totalCurrentTime = currentTime[0][newField[i].field];
      if (previousTime[0])
        totalPreviousTime = previousTime[0][newField[i].field];
      percentageDifference = +(
        ((totalCurrentTime - totalPreviousTime) / totalPreviousTime) *
        100
      ).toFixed(2);

      stats.push({
        current: totalCurrentTime,
        previous: totalPreviousTime,
        percentageDifference,
      });
    }
    res.status(200).json({
      time: req.query.time,
      stats,
    });
  });
