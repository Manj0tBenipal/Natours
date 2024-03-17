"use client";
import { deleteUser, getDocs } from "@/utils/server_actions/documentOperations";
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
  Modal,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { IoMdWarning } from "react-icons/io";

export default function UserTable() {
  const router = useRouter();

  const [reloadUsers, setReloadUsers] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableItems, setTableItems] = useState<User[]>([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState<"loading" | "idle">("idle");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isDeleting, setIsDeleting] = useState(false);
  //next-ui custom hook to  control the behavior of modal(confirmation dialogue before delete)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading("loading");
      const fields = ["role", "active", "name", "email", "_id", "photo"];
      const res = await getDocs("users", { page, limit }, fields);
      if (res.status === "fail") {
        console.log(res.error);
        return alert(res.error);
      }
      setTotalPages(res.data.totalPages);
      setTableItems(res.data.data);
      setIsLoading("idle");
    }
    fetchUsers();
  }, [page, limit, reloadUsers]);
  const renderCell = useCallback(
    (user: User, columnKey: string) => {
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
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => router.push(`/users/edit/${user._id}`)}
                >
                  <BiPencil />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedUser(user);
                    onOpen();
                  }}
                >
                  <BiTrash />
                </span>
              </Tooltip>
            </div>
          );
      }
    },
    [router, onOpen]
  );
  const handleDelete = useCallback(
    async (onClose: Function) => {
      try {
        setIsDeleting(true);
        if (!selectedUser?._id)
          throw new Error("Delete action invoked without selecting a user");
        const res = await deleteUser(selectedUser._id);
        if (res.status === "fail")
          throw new Error(
            res?.error || "Something went wrong Please try again."
          );
        alert(`Deleted ${selectedUser.name}`);

        setReloadUsers((prev) => !prev);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setSelectedUser({} as User);
        setIsDeleting(false);
        onClose();
      }
    },
    [selectedUser]
  );
  return (
    <>
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
      <Modal className="z-50" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-500">
                <div className="flex items-center justify-center">
                  <IoMdWarning /> Warning
                </div>
              </ModalHeader>
              <ModalBody>
                You are about to delete the user{" "}
                <b>
                  {selectedUser?.name}({selectedUser?.email})
                </b>{" "}
                This action cannot be reversed.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="ghost" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={() => {
                    handleDelete(onClose);
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
