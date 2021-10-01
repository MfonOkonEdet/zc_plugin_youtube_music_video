// @ts-ignore
import { GetUserInfo, GetWorkspaceUser } from "@zuri/control";
import { userDispatch } from "../store/usersSlice";
import User from "../types/user";

async function getUserInfo(email: string) {
  try {
    const info = await GetWorkspaceUser(email);

    return { email: info.email, name: info.user_name };
  } catch (error) {
    console.log(error.message);
    return { name: "", email };
  }
}
