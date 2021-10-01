// @ts-ignore
import { GetUserInfo, GetWorkspaceUser } from "@zuri/control";

import store from "../store";
import { userDispatch } from "../store/usersSlice";
import User from "../types/user";
import httpService from "./httpService";

const { addToRoom: enterEndpoint, leaveEndpoint } = httpService.endpoints;

async function addUserToList({ email, id }: { email: string; id: string }) {
  try {
    const info = await GetWorkspaceUser(email);

    // console.log({ workspaceInfo: info });

    userDispatch.addUser({ ...extractInfo(info), id });
  } catch (error) {
    console.log("Error: add to list", error.message);
  }
}

async function addUserToRoom() {
  try {
    const data = await GetUserInfo();

    // console.log({ userInfo: data });

    const { 0: info } = data;

    userDispatch.setCurrentUser(extractInfo(info));
    userDispatch.addUser(extractInfo(info));

    return httpService
      .post(enterEndpoint, { _id: info._id, email: info.email })
      .then(
        (r) => r,
        (e) => console.log(e.message)
      );
  } catch (error) {
    console.log("Error: add to room:", error.message);
  }
}

const extractInfo = (info) => ({
  id: info._id,
  avatar: info.image_url,
  name: info.display_name || info.user_name,
  email: info.email,
});

function removeUserFromRoom() {
  const { id } = store.getState().users.currentUser;

  return httpService.post(leaveEndpoint, { id }).then(
    (r) => userDispatch.removeUser({ id }),
    (e) => e
  );
}

const userService = {
  addUserToRoom,
  addUserToList,
  removeUserFromRoom,
};

export default userService;
