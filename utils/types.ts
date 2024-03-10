interface ServerActionRes {
  status: "success" | "fail";
  data: any | null;
  error: string | null;
}
interface User {
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
  startLocation: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
  };
  price: number;
  duration: 14;
  difficulty: "easy" | "difficult" | "hard";
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
interface Location {
  type: string;
  coordinates: number[];
  description: string;
  day: number;
  _id: string;
}

interface Review {
  _id: string;
  text?: string;
  tourId: string;
  user: User;
  rating: number;
  createdAt: Date;
}
