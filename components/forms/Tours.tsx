"use client";

import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import AutoCompleteLocationInput from "../ui/AutoCompleteLocationInput";

export default function Tours({ tourDetails }: { tourDetails: TourDetailed }) {
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

      <div className="flex flex-col gap-y-2 p-4 shadow-md rounded-2xl">
        <h1 className="text-2xl ">Start Location</h1>

        <AutoCompleteLocationInput
          defaultInput={tour.startLocation.address}
          description={tour.startLocation.description}
          setter={(
            location: Location,
            description: string,
            address?: string
          ) => {
            setTour((prev) => ({
              ...prev,
              ...location,
              description,
              address: address || "",
            }));
          }}
        />
      </div>
      <div className="flex flex-col gap-y-2 p-4 shadow-md rounded-2xl">
        <h1 className="text-2xl ">Locations</h1>
        <div className="md:grid md:grid-cols-2 md:gap-3 grid-auto-rows">
          {tour.locations.map((location: Location, index: number) => (
            <AutoCompleteLocationInput
              key={location.day}
              defaultInput={location.address}
              description={location.description}
              setter={(location: Location) => {
                const newLocations = [...tour.locations];
                newLocations[index] = location;
                setTour((prev) => ({ ...prev }));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
