"use client";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { getLocations } from "@/utils/server_actions/maps";
/**
 * This component is an input auto-complete tag that finds a location based on user's input
.
 */
export default function AutoCompleteLocationInput({
  setter,
  defaultInput,
}: {
  setter: (location: Location, address?: string) => void;
  defaultInput?: string;
}) {
  //current value in the input box
  const [currentSearchString, setCurrentSearchString] = useState<string>("");

  //location predictions from server
  const [locations, setLocations] = useState<PlacesAPILocation[]>([]);

  //decides UI changes when locations are being fetched from server
  const [loadingLocations, setLoadingLocations] = useState(false);

  //
  const [selectedAddress, setSelectedAddress] = useState(defaultInput || "");

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

  /**
   * createss a debouncing effect when user enter something in the location input
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

  return (
    <Autocomplete
      inputValue={currentSearchString}
      onInputChange={setCurrentSearchString}
      label="Start Location"
      placeholder="Search an animal"
      isLoading={loadingLocations}
      onSelectionChange={(key) => setSelectedAddress(key as string)}
    >
      {[locations].flat().map((item) => {
        return (
          <AutocompleteItem key={item.description} className="capitalize">
            {item.description}
          </AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
}
