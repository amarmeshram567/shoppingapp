import { settingRepository } from "../../repositories/settingRepository.js";

export const settingsService = {
  async getAll() {
    return settingRepository.findAll();
  },

  async getByGroup(group) {
    return settingRepository.findByGroup(group);
  },

  async saveGroup(group, values) {
    const results = [];
    for (const [key, value] of Object.entries(values)) {
      results.push(
        await settingRepository.upsert(`${group}.${key}`, {
          key: `${group}.${key}`,
          value,
          group
        })
      );
    }
    return results;
  }
};
