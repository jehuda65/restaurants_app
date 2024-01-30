import {
  MetaFunction,
  json,
  redirect,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useParams,
  useSubmit,
} from "@remix-run/react";
// import Restaurant from "./restaurants.$restaurantId";
import { createEmptyRestaurant, getRestaurants } from "../models/data";

import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Restaurants" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const restaurants = await getRestaurants(q);
  return json({ restaurants, q });
};

export const action = async () => {
  const restaurant = await createEmptyRestaurant();
  return redirect(`/restaurants/${restaurant.id}/edit`);
};

export default function Index() {
  const { restaurants, q } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchfield = document.getElementById("q");
    if (searchfield instanceof HTMLInputElement) {
      searchfield.value = q || "";
    }
  }, [q]);

  const params = useParams();

  useEffect(() => {
    const currentScrollPosition = window.scrollY;
    window.scrollTo({
      top: currentScrollPosition,
      behavior: "smooth",
    });
  }, [params]);
  return (
    <div>
      <section className="mt-16 flex items-center justify-center py-20 lg:py-32 bg-green-600">
        <h1 className="z-10 text-2xl md:text-3xl  text-center lg:text-left text-green-200/50">
          Welcome to the <br />{" "}
          <span className="text-white text-4xl md:text-5xl font-arbutus drop-shadow shadow-green-500">
            Restaurant Hub
          </span>
        </h1>
        <img
          className="absolute top-16 lg:top-24 right-2/3 opacity-50 md:opacity-80 h-1/4 md:h-1/3 lg:h-1/2 z-0 mix-blend-saturation"
          src="/img/croissant.png"
          alt=""
        />
        <div>
          <div></div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center md:items-end justify-center py-10 space-y-10 md:space-y-0 md:space-x-10 bg-gray-300">
        <p className="font-bold text-2xl text-green-600 md:mb-3">
          Search Restaurants
        </p>
        <Form
          id="search-form"
          onChange={(event) => {
            const isFirstSearch = q === null;
            submit(event.currentTarget, {
              replace: !isFirstSearch,
            });
          }}
          role="search"
          className="flex bg-gray-100 rounded-lg p-1 font-semibold"
        >
          <input
            aria-label="Search restaurants"
            defaultValue={q || ""}
            id="q"
            name="q"
            className=" rounded-md border border-gray-300/70 focus:ring-none shadow-inner focus:border-0.5 focus:border-green-600/20"
            placeholder={searching ? "loading" : "search restaurants"}
            type="search"
          />
          <div aria-hidden hidden={!searching} id="search-spinner"></div>
          {/* <button
            className="bg-green-500 flex items-center px-3 rounded-md hover:bg-opacity-75"
            type="submit"
          >
            Search
          </button> */}
        </Form>
      </section>
      {/* <SearchForm /> */}
      <section className="flex flex-col items-center justify-center py-20 bg-gray-200">
        <div className="flex ">
          <h2 className="font-bold text-2xl pb-10">Restaurants in your area</h2>
          <Form method="post">
            <button
              type="submit"
              className="bg-green-500 py-1.5 px-3 ml-4 rounded-md shadow text-white font-semibold hover:bg-opacity-80 active:bg-green-700 duration-200"
            >
              Add New <span className="font-bold">+</span>
            </button>
          </Form>
        </div>
        {/* <EditRestaurant /> */}

        {restaurants.length ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:w-2/3 mx-auto font-semibold px-4 mt-10">
            {restaurants.map((restaurant) => (
              <li
                className="bg-gray-100 w-full max-h-48 flex flex-col rounded-md shadow"
                key={restaurant.id}
              >
                <img
                  alt={restaurant.id}
                  src={restaurant.avatar}
                  className=" object-cover h-1/2 basis-3/4 rounded-t-md"
                />
                <Link
                  to={`restaurants/${restaurant.id}`}
                  className="flex items-center px-4 py-2  hover:bg-green-200 duration-200"
                >
                  {restaurant.first || restaurant.last ? (
                    <div>
                      <p>
                        {restaurant.first} {restaurant.last}
                      </p>

                      <p className="text-gray-400 text-sm ">
                        {restaurant.location}
                      </p>
                    </div>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {restaurant.favorite ? <span>★</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No restaurants</i>
          </p>
        )}
      </section>
    </div>
  );
}
