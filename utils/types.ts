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
