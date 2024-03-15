"use client";
import { getUsers } from "@/utils/serverActions";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  User,
  Tooltip,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableItems, setTableItems] = useState<User[]>([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState<"loading" | "idle">("idle");
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading("loading");
      const res = await getUsers(JSON.stringify({ limit: limit, page: page }));
      if (res.status === "fail") {
        console.log(res.error);
        return alert(res.error);
      }
      setTotalPages(res.data.totalPages);
      setTableItems(res.data.data);
      setIsLoading("idle");
    }
    fetchUsers();
  }, [page, limit]);
  const renderCell = useCallback((user: User, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `/users/${user.photo}`,
            }}
            description={user.email}
            name={user[columnKey]}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <p className="text-bold text-sm capitalize">{user[columnKey]}</p>
        );
      case "active":
        return (
          <Chip
            className="text-white"
            color={`${user[columnKey] === true ? "success" : "danger"}`}
          >
            {user[columnKey] === true ? "Active" : "Inactive"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-3">
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <BiPencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <BiTrash />
              </span>
            </Tooltip>
          </div>
        );
    }
  }, []);
  return (
    <Table
      aria-label="Example table with client async pagination"
      isStriped
      bottomContent={
        totalPages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="active">Status</TableColumn>
        <TableColumn key="role">Role</TableColumn>
        <TableColumn key="actions">Actions</TableColumn>
      </TableHeader>
      <TableBody
        items={tableItems ?? []}
        loadingState={isLoading}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={item?.name}>
            {(columnKey) => (
              <TableCell> {renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
