import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getRestaurant, updateRestaurant } from "../models/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.restaurantId, "Missing restaurantId param");
  const restaurant = await getRestaurant(params.restaurantId);
  if (!restaurant) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ restaurant });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.restaurantId, "Missing restaurantId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateRestaurant(params.restaurantId, updates);
  return redirect(`/restaurants/${params.restaurantId}`);
};

export default function EditRestaurant() {
  const { restaurant } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form
      className="absolute top-24 left-0 flex flex-col ml-10 space-y-5"
      key={restaurant.id}
      id="restaurant-form"
      method="post"
    >
      <p className="flex space-x-5 items-center">
        <span className="mr-4">Name</span>
        <input
          defaultValue={restaurant.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={restaurant.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label className="flex space-x-5 items-center">
        <span>Location</span>
        <input
          defaultValue={restaurant.location}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label className="flex space-x-1 items-center">
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={restaurant.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label className="flex space-x-10 items-start">
        <span>Notes</span>
        <textarea
          defaultValue={restaurant.notes}
          name="notes"
          rows={6}
          className="w-full"
        />
      </label>
      <p className="flex place-content-around">
        <button
          className="bg-green-300 rounded-md py-2 px-4 font-semibold hover:bg-opacity-80"
          type="submit"
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 rounded-md py-2 px-4 font-semibold hover:bg-opacity-80"
          type="button"
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
