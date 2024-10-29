export type APIResponseType = {
  status: 'success' | 'error';
  message: string;
};
export type LoginResponseType = {
  token: string;
  data: { fullName: string };
} & APIResponseType;
export const LoginResponse = (
  message: string,
  token: string,
  data: { fullName: string },
): LoginResponseType => {
  return {
    status: 'success',
    message,
    token,
    data,
  };
};
export const APIResponse = (
  message: string,
  status: 'success' | 'error' = 'success',
): APIResponseType => {
  return {
    status,
    message,
  };
};
