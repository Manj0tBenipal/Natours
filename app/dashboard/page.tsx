"use client";

import { UserContext } from "@/components/providers/UserContextProvider";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import UserTable from "@/components/ui/UserTable";
import TourTable from "@/components/ui/TourTable";
import { deleteDoc } from "@/utils/server_actions/documentOperations";
import { IoMdWarning } from "react-icons/io";

export default function Dasboard() {
  //currently logged in user
  const { user } = useContext(UserContext);

  //state variables
  const [limit, setLimit] = useState(7);
  const [selectedCollection, setSelectedCollection] = useState("users");

  /*changed to true after a user deletes a document. used to decide whether to reload
   *tables or not
   */
  const [reload, setReload] = useState(false);

  /*
   * The UI for deleting Document is shared between Tours and Users collection.
   * When user clicks on delete Icon openModal function is invoked in child table components
   *  which accepts the document on which the action is performend.
   * The doument is then saved in the selectedDoc state which is then used to display necessary
   * information in the Modal and selectedDoc._id is used to delete the Doc from database
   */
  const [isDeleting, setIsDeleting] = useState(false);

  /*details that are retrived from child table componenets and displayed in modal while
   *taking confirmation from the user and while deleting the doc
   */
  const [docDetails, setDocDetails] = useState<DocDetails>();

  /**
   * Initiates a request to delete doc from database and handles UI changes
   * accroding to the state of request
   * The function is memoized and only re-rendered when selectedDoc changes
   * @returns {boolean} true if the document is deleted and false if user canceled the
   *                    operation or an error occured
   */
  const handleDelete = useCallback(
    async (collection: collection, onClose: () => void): Promise<boolean> => {
      try {
        setIsDeleting(true);
        if (!docDetails) {
          alert("Delete action invoked without selecting an item.");
          return false;
        }
        const res = await deleteDoc(collection, docDetails._id);
        if (res.status === "fail")
          throw new Error(
            res?.error || "Something went wrong Please try again."
          );
        alert(`Deleted Successfully}`);
        return true;
      } catch (err: any) {
        alert(err.message);
        return false;
      } finally {
        setIsDeleting(false);
        onClose();
      }
    },
    [docDetails]
  );

  //next-ui custom hook to  control the behavior of modal(confirmation dialogue before delete)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * passed down to child table components to make the modal appear and
   * to retrieve the object on which deletion is being performed
   * @param {DocDetails} selectedDoc
   */
  const openModal = useCallback(
    (details: DocDetails) => {
      setDocDetails(details);
      onOpen();
    },
    [onOpen]
  );
  //if user is not logged in, restrict the access
  if (Object.keys(user).length === 0)
    return <h1>Please log in to access this route.</h1>;

  //if user is not admin restrict the access
  if (user?.role !== "admin")
    return <h1>Your are not allowed to access this route.</h1>;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-start">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="solid" color="primary" className="font-bold">
              {selectedCollection.toUpperCase()}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Action event example"
            onAction={(key) => setSelectedCollection(key.toString())}
          >
            <DropdownItem key="users">Users</DropdownItem>
            <DropdownItem key="tours">Tours</DropdownItem>
            <DropdownItem key="bookings">Bookings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {selectedCollection === "users" ? (
        <UserTable deleteDoc={openModal} limit={limit} reload={reload} />
      ) : selectedCollection === "tours" ? (
        <TourTable deleteDoc={openModal} limit={limit} reload={reload} />
      ) : (
        <div></div>
      )}
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
                You are about to delete a document from{" "}
                {docDetails?.type === "tours" ? "tours" : "users"} with name{" "}
                <b>{docDetails?.name}</b>. This action cannot be reversed.
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="ghost" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={async () => {
                    if (!docDetails?.type)
                      return alert("failed to decide collection type");
                    const deleted = await handleDelete(
                      docDetails?.type,
                      onClose
                    );
                    if (deleted) setReload((prev) => !prev);
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
