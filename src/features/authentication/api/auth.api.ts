import { EndUser } from "@shared-types/enduser.type";
import { ztLoginInputs } from "../libs/login.zod";
import {
  LOGIN_API_ENDPOINT,
  REGISTER_API_ENDPOINT,
  REQUEST_OTP_ENDPOINT,
  VERIFY_OTP_ENDPOINT,
} from "./auth-endpoints.api";
import { axiosInstance } from "@shared-libs/axios/axios.base";
import { ztRegisterInputs } from "../libs/register.zod";
import { ztRequestOTPInputs, ztVerifyOTPInputs } from "../libs/otp.zod";
import { ServerError } from "@shared-types/server-error.type";

type LoginResponse = {
  access_token: string;
  token_type?: string;
  user?: EndUser;
};

const login = async (
  values: ztLoginInputs
): Promise<LoginResponse | ServerError> => {
  try {
    // Backend requires JSON body: { email, password }
    const result = await axiosInstance.post<LoginResponse>(LOGIN_API_ENDPOINT, {
      email: values.email,
      password: values.password,
    });
    return result.data;
  } catch (error) {
    const errorr = error as any;

    // Make console truly useful
    if (errorr.response) {
      console.error("AXIOS ERROR: Server responded with non-2xx status");
      console.error("Status:", errorr.response.status);
      console.error("Headers:", errorr.response.headers);
      console.error("Data:", errorr.response.data);
    } else if (errorr.request) {
      console.error("AXIOS ERROR: Request made but no response received");
      console.error("Request:", errorr.request);
    } else {
      console.error("AXIOS ERROR: Something happened while setting up request");
      console.error("Message:", errorr.message);
    }

    // Always log full stack for debugging
    console.error("AXIOS STACK:", errorr.stack);
    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

const register = async (
  values: ztRegisterInputs
): Promise<EndUser | ServerError> => {
  try {
    const result = await axiosInstance.post<EndUser>(
      REGISTER_API_ENDPOINT,
      values
    );
    return result.data;
  } catch (error) {
    const errorr = error as any;

    // Make console truly useful
    if (errorr.response) {
      console.error("AXIOS ERROR: Server responded with non-2xx status");
      console.error("Status:", errorr.response.status);
      console.error("Headers:", errorr.response.headers);
      console.error("Data:", errorr.response.data);
    } else if (errorr.request) {
      console.error("AXIOS ERROR: Request made but no response received");
      console.error("Request:", errorr.request);
    } else {
      console.error("AXIOS ERROR: Something happened while setting up request");
      console.error("Message:", errorr.message);
    }

    // Always log full stack for debugging
    console.error("AXIOS STACK:", errorr.stack);
    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

const getCurrentUser = async (): Promise<EndUser | ServerError> => {
  try {
    const result = await axiosInstance.get<EndUser>("/auth/me");
    return result.data;
  } catch (error) {
    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

type RequestOTPResponse = {
  message: string;
  expiresIn?: number;
};

const requestOTP = async (
  values: ztRequestOTPInputs
): Promise<RequestOTPResponse | ServerError> => {
  try {
    const result = await axiosInstance.post<RequestOTPResponse>(
      REQUEST_OTP_ENDPOINT,
      {
        email: values.email,
      }
    );
    return result.data;
  } catch (error) {
    const errorr = error as any;

    if (errorr.response) {
      console.error("AXIOS ERROR: Server responded with non-2xx status");
      console.error("Status:", errorr.response.status);
      console.error("Data:", errorr.response.data);
    } else if (errorr.request) {
      console.error("AXIOS ERROR: Request made but no response received");
    } else {
      console.error("AXIOS ERROR: Something happened while setting up request");
      console.error("Message:", errorr.message);
    }

    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

const verifyOTP = async (
  values: ztVerifyOTPInputs
): Promise<LoginResponse | ServerError> => {
  try {
    const result = await axiosInstance.post<LoginResponse>(
      VERIFY_OTP_ENDPOINT,
      {
        email: values.email,
        otp: values.otp,
      }
    );
    return result.data;
  } catch (error) {
    const errorr = error as any;

    if (errorr.response) {
      console.error("AXIOS ERROR: Server responded with non-2xx status");
      console.error("Status:", errorr.response.status);
      console.error("Data:", errorr.response.data);
    } else if (errorr.request) {
      console.error("AXIOS ERROR: Request made but no response received");
    } else {
      console.error("AXIOS ERROR: Something happened while setting up request");
      console.error("Message:", errorr.message);
    }

    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

export { login, register, getCurrentUser, requestOTP, verifyOTP };
