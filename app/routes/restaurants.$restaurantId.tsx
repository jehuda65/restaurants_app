import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import type { FunctionComponent } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";

import { getRestaurant, updateRestaurant } from "../models/data";

import type { RestaurantRecord } from "../models/data";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.restaurantId, "Missing restaurantId param");
  const restaurant = await getRestaurant(params.restaurantId);
  if (!restaurant) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ restaurant });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.restaurantId, "Missing RestaurantId param");
  const formData = await request.formData();
  return updateRestaurant(params.restaurantId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Restaurant() {
  const { restaurant } = useLoaderData<typeof loader>();

  //   const restaurant = {
  //     first: "Your",
  //     last: "Name",
  //     avatar: "https://placekitten.com/g/200/200",
  //     location: "your_handle",
  //     notes: "Some notes",
  //     favorite: true,
  //   };

  return (
    <div
      id="restaurant"
      className="mt-28 flex flex-col items-center  mx-[5%] bg-gray-100 rounded-t"
    >
      <div className="w-full h-1/2">
        <img
          alt={`${restaurant.first} ${restaurant.last} avatar`}
          key={restaurant.avatar}
          src={restaurant.avatar}
          className="w-full max-h-52 object-cover object-center rounded-t"
        />
      </div>

      <div className="space-y-5 w-full pl-10 py-8 ">
        <h1 className="text-2xl font-bold flex gap-8">
          {restaurant.first || restaurant.last ? (
            <>
              {restaurant.first} {restaurant.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite restaurant={restaurant} />
        </h1>

        {restaurant.location ? <p>{restaurant.location}</p> : null}

        {restaurant.notes ? <p>{restaurant.notes}</p> : null}

        <div className="flex space-x-8">
          <Form action="edit">
            <button
              className="font-semibold bg-gray-200 py-2 px-4 rounded-md shadow hover:bg-opacity-80"
              type="submit"
            >
              Edit
            </button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button
              className="font-semibold bg-gray-200 text-red-400 py-2 px-4 rounded-md shadow hover:bg-opacity-80"
              type="submit"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  restaurant: Pick<RestaurantRecord, "favorite">;
}> = ({ restaurant }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : restaurant.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
