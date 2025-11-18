import { EndUser } from "@shared-types/enduser.type";
import { ztLoginInputs } from "../libs/login.zod";
import {
  LOGIN_API_ENDPOINT,
  REGISTER_API_ENDPOINT,
} from "./auth-endpoints.api";
import { axiosInstance } from "@shared-libs/axios/axios.base";
import { ztRegisterInputs } from "../libs/register.zod";
import { ServerError } from "@shared-types/server-error.type";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: EndUser;
};

const login = async (values: ztLoginInputs): Promise<LoginResponse> => {
  try {
    const result = await axiosInstance.post<LoginResponse>(
      LOGIN_API_ENDPOINT,
      values
    );
    return result.data;
  } catch (error) {
    return (error as any).response.data;
  }
};

const register = async (values: ztRegisterInputs): Promise<EndUser> => {
  try {
    const result = await axiosInstance.post<EndUser>(
      REGISTER_API_ENDPOINT,
      values
    );
    return result.data;
  } catch (error) {
    return (error as any).response.data;
  }
};
export { login, register };
