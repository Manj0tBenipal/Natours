"use client";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getLatLngFromAddress,
  getLocations,
} from "@/utils/server_actions/maps";

/**
 * This component is an input auto-complete tag that finds a location based on user's input
.
 */
export default function AutoCompleteLocationInput({
  setter,
  location,
}: {
  setter: (location: Location) => void;
  location: Location;
}) {
  //c
  const [newLocation, setNewLocation] = useState<Location>(location);

  //current value in the input box. deciding factor whether to make a request to the server or not
  const [currentSearchString, setCurrentSearchString] = useState<string>(
    location.address
  );

  const [selectedAddress, setSelectedAddress] = useState<string>();
  //location predictions from server
  const [locations, setLocations] = useState<PlacesAPILocation[]>([]);

  //decides UI changes when locations are being fetched from server
  const [loadingLocations, setLoadingLocations] = useState(false);

  //fetches locations based on the provided address string
  const fetchLocations = useCallback(async (searchString: string) => {
    try {
      setLoadingLocations(true);
      const res = await getLocations(searchString);
      if (res.status === "fail")
        throw new Error(
          res.error || "Failed to get locations data from Google"
        );
      setLocations(res.data);
    } catch (err: any) {
      alert(err?.message || "Failed to connect to server to get locations");
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  const fetchLatLng = useCallback(async (address: string) => {
    try {
      const res = await getLatLngFromAddress(address);
      if (res.status === "fail")
        throw new Error(res.error || "Failed to connect to server");
      const { lat, lng } = res.data;
      setNewLocation((prev) => ({ ...prev, coordinates: [lng, lat] }));
    } catch (err: any) {
      alert(err.message);
    }
  }, []);
  //memoized options for locations
  const locationOptions = useMemo(() => {
    const locationOptionElements = locations.map((item) => (
      <AutocompleteItem key={item.description}>
        {item.description}
      </AutocompleteItem>
    ));

    return locationOptionElements;
  }, [locations]);

  /**
   * creates a debouncing effect when user enter something in the location input
   * makes a request only after a certain amount of time has passed after the last change to
   * currentSearchString
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLocations(currentSearchString);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [currentSearchString, fetchLocations]);

  useEffect(() => {
    if (!selectedAddress) return;
    setNewLocation((prev): Location => ({ ...prev, address: selectedAddress }));
    fetchLatLng(selectedAddress);
  }, [selectedAddress, fetchLatLng]);

  useEffect(() => {
    if (newLocation !== location) {
      console.log("Compared and saved");
      setter(newLocation);
    }
  }, [newLocation, setter, location]);
  return (
    <div className="md:grid md:grid-cols-2 md:gap-x-3">
      <Autocomplete
        //default value wen the component first mounts
        defaultInputValue={currentSearchString}
        //triggers when text inside the input changes
        onInputChange={setCurrentSearchString}
        label="Start Location"
        placeholder="34 West Ave."
        //changes the state to loading when new locations are being fetched
        isLoading={loadingLocations}
        //triggered when a user selects a location from provided options
        onSelectionChange={(key) => setSelectedAddress(key as string)}
      >
        {locationOptions}
      </Autocomplete>
      <Input
        value={newLocation.description}
        name="description"
        label="Location Description"
        type="text"
        onChange={(e) =>
          setNewLocation((prev) => ({ ...prev, description: e.target.value }))
        }
      />
    </div>
  );
}
