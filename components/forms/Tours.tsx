"use client";

import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import AutoCompleteLocationInput from "../ui/AutoCompleteLocationInput";
import { useRouter } from "next/navigation";
import { editDoc } from "@/utils/server_actions/documentOperations";

export default function Tours({ tourDetails }: { tourDetails: TourDetailed }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [tour, setTour] = useState(tourDetails);

  //available options for dificulty levels for locations
  const difficulties = ["easy", "medium", "difficult"];

  //handles change in inout elements and sets the states accordingly(controlled components)
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTour((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const res = await editDoc("tours", tour);
      if (res.status === "fail")
        throw new Error(res?.error || "failed to save data to database");
      if (res.status === "success") alert("Saved Successfully");
    } catch (err: any) {
      alert(err?.message || "Failed to connect to server. Please try again");
    } finally {
      setIsSaving(false);
    }
  }, [tour]);
  return (
    <div className="flex flex-col gap-y-3 p-4 bg-white shadow-md rounded-2xl">
      <Input
        value={tour.name}
        onChange={handleInput}
        name="name"
        label="Tour name"
        type="text"
      />
      <div className="md:grid md:grid-cols-2 md:gap-3 grid-auto-rows">
        <Input
          value={tour.price.toString()}
          onChange={handleInput}
          name="price"
          label="Tour name"
          type="number"
        />

        <Select
          name="difficulty"
          label="Select the level of difficulty"
          onChange={handleInput}
          defaultSelectedKeys={[tour.difficulty]}
        >
          {difficulties.map((level) => (
            <SelectItem key={level} value={level}>
              {level.toUpperCase()}
            </SelectItem>
          ))}
        </Select>
        <Input
          value={tour.duration.toString()}
          onChange={handleInput}
          name="duration"
          label="Tour duration"
          type="number"
          min={1}
        />
        <Input
          isDisabled
          value={Math.ceil(tour.duration / 7).toString()}
          name="durationWeeks"
          label="Tour duration in weeks"
          type="number"
        />
      </div>
      <Textarea
        name="description"
        label="Description"
        value={tour.description}
        placeholder="Enter your description"
        onChange={handleInput}
      />
      <Textarea
        name="summary"
        label="Summary"
        value={tour.summary}
        placeholder="Enter your Summary"
        onChange={handleInput}
      />
      {/* Start Location of a tour. Setter function needs to be provided separately as start location and locations(spots where tour will be conducted
  are stored in different keys in the tour Object. The setter function accepts  location object and changes the state of parent accordingly) */}
      <div className="flex flex-col gap-y-2 p-4 shadow-md rounded-2xl">
        <h1 className="text-2xl ">Start Location</h1>

        <AutoCompleteLocationInput
          location={tour.startLocation}
          setter={(location: Location) => {
            setTour((prev) => ({
              ...prev,
              startLocation: location,
            }));
          }}
        />
      </div>
      {/* locations are an array of Location objects each of which is passed a setter function which changes respective objects when a 
      change is made to one or more locations */}
      <div className="flex flex-col gap-y-2 p-4 shadow-md rounded-2xl">
        <h1 className="text-2xl ">Locations</h1>
        <div className="md:grid md:grid-cols-2 md:gap-3 grid-auto-rows">
          {tour.locations.map((location: Location, index: number) => (
            <AutoCompleteLocationInput
              key={location.day + location.address}
              location={location}
              setter={(location: Location) => {
                const newLocations = [...tour.locations];
                newLocations[index] = location;
                setTour((prev) => ({ ...prev, locations: newLocations }));
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Button
          variant="solid"
          color="primary"
          onClick={handleSave}
          isLoading={isSaving}
        >
          Save
        </Button>
        <Button variant="solid" color="danger" onClick={() => router.back()}>
          Discard
        </Button>
      </div>
    </div>
  );
}
