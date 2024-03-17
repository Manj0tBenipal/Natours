"use client";
import { getDocs } from "@/utils/server_actions/documentOperations";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {  useCallback, useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { IoMdWarning } from "react-icons/io";
export default function TourTable() {
  const router = useRouter();
  const [reloadTours, setReloadTours] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableItems, setTableItems] = useState<TourDetailed[]>([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState<"loading" | "idle">("idle");
  const [selectedTour, setSelectedTour] = useState<TourDetailed>();
  const [isDeleting, setIsDeleting] = useState(false);

  //next-ui custom hook to  control the behavior of modal(confirmation dialogue before delete)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading("loading");
      const res = await getDocs("tours", { page, limit });
      if (res.status === "fail") {
        return alert(res.error);
      }
      setTotalPages(res.data.totalPages);
      setTableItems(res.data.data);
      setIsLoading("idle");
    };
    fetchTours();
  }, [page, reloadTours, limit]);

  
  const renderCell = useCallback((tour: TourDetailed, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return <p>{tour.name}</p>;
      case "price":
        return <p>{tour.price}</p>;
      case "difficulty":
        return <p>{tour.difficulty}</p>;
      case "rating":
        return <p>{tour.ratingsAverage}</p>;
      case "guides":
        return <p>{tour.guides.length}</p>;
      case "actions":
        return (
          <div className="relative flex items-center gap-3">
            <Tooltip content="Edit user">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => router.push(`/tours/edit/${tour._id}`)}
              >
                <BiPencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete tour">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedTour(tour);
                  onOpen();
                }}
              >
                <BiTrash />
              </span>
            </Tooltip>
          </div>
        );
    }
  }, []);
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
          <TableColumn key="price">Price</TableColumn>
          <TableColumn key="difficulty">Difficulty</TableColumn>
          <TableColumn key="rating">Rating</TableColumn>
          <TableColumn key="guides">Guides</TableColumn>
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
                You are about to delete the tour named <b>{selectedTour?.name}</b>{" "}
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
                    // handleDelete(onClose);
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
