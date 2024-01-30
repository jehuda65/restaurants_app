import { matchSorter } from "match-sorter";

import sortBy from "sort-by";
import invariant from "tiny-invariant";

type RestaurantMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  location?: string;
  notes?: string;
  favorite?: boolean;
};

export type RestaurantRecord = RestaurantMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeRestaurants = {
  records: {} as Record<string, RestaurantRecord>,

  async getAll(): Promise<RestaurantRecord[]> {
    return Object.keys(fakeRestaurants.records)
      .map((key) => fakeRestaurants.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<RestaurantRecord | null> {
    return fakeRestaurants.records[id] || null;
  },

  async create(values: RestaurantMutation): Promise<RestaurantRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newrestaurant = { id, createdAt, ...values };
    fakeRestaurants.records[id] = newrestaurant;
    return newrestaurant;
  },

  async set(id: string, values: RestaurantMutation): Promise<RestaurantRecord> {
    const restaurant = await fakeRestaurants.get(id);
    invariant(restaurant, `No restaurant found for ${id}`);
    const updatedrestaurant = { ...restaurant, ...values };
    fakeRestaurants.records[id] = updatedrestaurant;
    return updatedrestaurant;
  },

  destroy(id: string): null {
    delete fakeRestaurants.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getRestaurants(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let restaurants = await fakeRestaurants.getAll();
  if (query) {
    restaurants = matchSorter(restaurants, query, {
      keys: ["first", "last"],
    });
  }
  return restaurants.sort(sortBy("last", "createdAt"));
}

export async function createEmptyRestaurant() {
  const restaurant = await fakeRestaurants.create({});
  return restaurant;
}

export async function getRestaurant(id: string) {
  return fakeRestaurants.get(id);
}

export async function updateRestaurant(
  id: string,
  updates: RestaurantMutation
) {
  const restaurant = await fakeRestaurants.get(id);
  if (!restaurant) {
    throw new Error(`No Restaurants found for ${id}`);
  }
  await fakeRestaurants.set(id, { ...restaurant, ...updates });
  return restaurant;
}

export async function deleteRestaurant(id: string) {
  fakeRestaurants.destroy(id);
}

[
  {
    avatar:
      "https://media-cdn.tripadvisor.com/media/photo-s/29/e6/e4/8a/entry-and-menu.jpg",
    first: "Met Su Yan",
    last: "",
    location: "Edgware, Greater London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/611bea80c15cf5da489ecbcc/master/w_960%2Cc_limit/clove-club-traveller-8may13-pr-yuki-sugiura.jpg",
    first: "The Clove",
    last: "Club",
    location: "Shoreditch, London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/611be76c8c1b7286f1c10f5c/master/w_960%2Cc_limit/9chishuru-nov20-pr.jpg",
    first: "Chishuru",
    last: "",
    location: "Fitzrovia, London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/61ea8695ee72dddc7feed83c/master/w_960%2Cc_limit/london-feb20-SILO-jan22-Clare-Lewington-(4).jpg",
    first: "Silo",
    last: "",
    location: "Hackney Wick, London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/611bea66ae2ff768cb252cb7/master/w_960%2Cc_limit/garden-at-rochelle-canteen-rochelle-school-shoreditch-london-conde-nast-traveller-24june16-pr.jpg",
    first: "Rochelle",
    last: "Canteen",
    location: "Shoreditch, London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/63b55bc86903f6cd31fc0151/master/w_960%2Cc_limit/chets%2520hoxton-dec22-pr.jpeg",
    first: "Chet's",
    last: "",
    location: "Shepherd's Bush, London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/611bf58ba106ea5ed309b11d/master/w_960%2Cc_limit/bar-counter-london-jan20-pr.jpg",
    first: "Jikoni",
    last: "",
    location: "Marylebone, London",
  },
  {
    avatar:
      "https://media.cntraveller.com/photos/611be766042ccafe9a9ad6af/master/w_960%2Cc_limit/smoking-goat-restaurant-london-conde-nast-traveller-22nov17-pr.jpg",
    first: "Smoking Goat",
    last: "",
    location: "Shoreditch, London",
  },
  {
    avatar:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/f1/66/af/outdoors-in-the-sunshine.jpg?w=600&h=400&s=1",
    first: "Tony Page",
    last: "@ Island Grill",
    location: "The Lancasters, London",
  },
  {
    avatar:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/81/88/d4/hummus-bar-golders-green.jpg?w=600&h=-1&s=1",
    first: "Hummus",
    last: "Bar",
    location: "Golders Green, London",
  },
  {
    avatar:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/6c/2e/25/white-fish.jpg?w=600&h=-1&s=1",
    first: "White Fish",
    last: "",
    location: "Hendon, London",
    menu: "https://whitefishrestaurant.co.uk/menus/sample-menu/",
  },
  {
    avatar:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c1/b2/09/mixed-grill.jpg?w=600&h=-1&s=1",
    first: "La Fiesta",
    last: "Steakhouse",
    location: "Golders Green",
  },
  {
    avatar:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/0e/f4/a8/one-ashbourne-at-night.jpg?w=600&h=400&s=1",
    first: "One Ashbourne",
    last: "",
    location: "Temple Fortune, London",
  },
  {
    avatar:
      "https://novellinorestaurant.com/assets/uploads/2023/01/novellino_2617_001-scaled.jpg",
    first: "Novellino",
    last: "",
    location: "Golders Green, London",
    website: "https://novellinorestaurant.com/",
  },
  {
    avatar:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/31/c3/ae/sharing-is-caring.jpg?w=600&h=-1&s=1",
    first: "Pizaza",
    last: "",
    location: "Hendon, London",
  },
].forEach((restaurant) => {
  fakeRestaurants.create({
    ...restaurant,
    id: `${restaurant.first.toLowerCase()}-${restaurant.last.toLocaleLowerCase()}`,
  });
});
