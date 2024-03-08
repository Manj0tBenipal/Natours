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
  ratingsAverage: string;
  summary: string;
  imageCover: string;
  price: number;
  difficulty: string;
}
