interface ServerActionRes {
  status: "success" | "fail";
  data: any | null;
  error: string | null;
}
interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  active: boolean;
}
interface NewUser {
  name: string;
  email: string;
  photo: string;
}
interface TourShort {
  _id: string;
  name: string;
  ratingsAverage: number;
  summary: string;
  imageCover: string;
  price: number;
  difficulty: string;
}

interface TourDetailed {
  _id: string;
  name: string;
  startLocation: Location;
  price: number;
  duration: 14;
  difficulty: Difficulty;
  ratingsQuantity: number;
  ratingsAverage: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: Date[];
  locations: Location[];
  guides: User[];
  reviews: Review[];
}
type Difficulty = "easy" | "medium" | "difficult";
interface Location {
  type: string;
  coordinates: number[];
  description: string;
  address: string;
  day?: number;
}

interface Review {
  _id?: string;
  text?: string;
  tourId: string;
  user: User;
  rating: number;
  createdAt: Date;
}

interface Filters {
  page: number;
  limit: number;
}

interface DocDetails {
  _id: string;
  name: string;
  type: collection;
}

type collection = "tours" | "users";

interface PlacesAPILocation {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
