export type LoginResponseType = {
  message: string;
  token: string;
  data: {
    fullName: string;
  };
};
export const LoginResponse = (
  message: string,
  token: string,
  data: { fullName: string },
): LoginResponseType => {
  return {
    message,
    token,
    data,
  };
};
