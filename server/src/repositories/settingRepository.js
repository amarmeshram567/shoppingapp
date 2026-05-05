import { Setting } from "../models/Setting.js";

export const settingRepository = {
  findByGroup: (group) => Setting.find({ group }).sort({ key: 1 }),
  findAll: () => Setting.find({}).sort({ group: 1, key: 1 }),
  upsert: (key, payload) =>
    Setting.findOneAndUpdate({ key }, payload, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    })
};
