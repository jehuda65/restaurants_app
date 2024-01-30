import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteRestaurant } from "../models/data";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.restaurantId, "Missing restaurantId param");
  await deleteRestaurant(params.restaurantId);
  return redirect("/");
};
