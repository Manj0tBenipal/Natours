"use client";
import { getDocs } from "@/utils/server_actions/documentOperations";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
export default function TourTable({
  deleteDoc,
  limit,
  reload,
}: {
  limit: number;
  deleteDoc: (details: DocDetails) => void;
  reload: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableItems, setTableItems] = useState<TourDetailed[]>([]);
  const [isLoading, setIsLoading] = useState<"loading" | "idle">("idle");

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
  }, [limit, page, reload]);

  const renderCell = useCallback(
    (tour: TourDetailed, columnKey: string) => {
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
              <Tooltip content="Edit tour">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() =>
                    router.push(`${pathname}/tours/edit/${tour._id}`)
                  }
                >
                  <BiPencil />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete tour">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => {
                    deleteDoc({
                      _id: tour._id,
                      type: "tours",
                      name: tour.name,
                    });
                  }}
                >
                  <BiTrash />
                </span>
              </Tooltip>
            </div>
          );
      }
    },
    [deleteDoc, router]
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
    </>
  );
}
