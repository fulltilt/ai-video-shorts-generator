"use server";

import { signOut } from "./authConfig";

export const handleSignOut = async () => {
  try {
    await signOut({ redirectTo: "/", redirect: true });
  } catch (error) {
    throw error;
  }
};
