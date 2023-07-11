import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = `http://localhost:8000`;

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({
    cityName: "Madrid",
    country: "Spain",
    emoji: "🇪🇸",
    date: "2027-07-15T08:22:53.976Z",
    notes: "",
    position: {
      lat: 40.46635901755316,
      lng: -3.7133789062500004,
    },
    id: 17806751,
  });

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data);
        setCities(data);
      } catch {
        alert("There was an error loading data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      console.log(data);

      console.log(data);
      setCurrentCity(data);
    } catch {
      console.log("error");
      alert("There was an error loading data...from getCity");
    } finally {
      setIsLoading(false);
    }
  }
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch {
      console.log("error");
      alert("There was an error uploading data...from createCity");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("Cities context was used outside the citites provider");

  return context;
}

export { CitiesProvider, useCities };
