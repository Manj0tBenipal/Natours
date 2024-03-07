interface ServerActionRes {
  status: "success" | "fail";
  data: any | null;
  error: string | null;
}
