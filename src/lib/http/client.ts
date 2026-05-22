import axios, { type CreateAxiosDefaults } from "axios";

export function createHttpClient(config: CreateAxiosDefaults) {
  return axios.create({
    timeout: 30_000,
    ...config,
  });
}
