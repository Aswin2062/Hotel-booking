"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import CardDetails from "../../components/Card";
import BgImage from "@/public/vacation.jpg";
import Category from "../../components/Category";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { HotelService } from "@/services/HotelService";
import Swal from "sweetalert2";

const HomePage = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [dates, setDates] = useState<[Date, Date] | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLocation(input);

    if (input.length > 0) {
      const filtered = locations.filter((loc) =>
        loc.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredLocations(filtered);
      setDropdownOpen(true);
    } else {
      setFilteredLocations(locations);
      setDropdownOpen(false);
    }
  };

  const selectLocation = (selected: string) => {
    setLocation(selected);
    setDropdownOpen(false);
  };

  const handleSearch = () => {
    if (!location.trim().length) {
      Swal.fire({
        icon: "error",
        title: "Search Failure",
        text: "Please Select Location",
        toast: true,
        position: "top-right",
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }
    var dateSearchString = "";
    if (dates != null) {
      dateSearchString = `${dates[0].getTime()}-${dates[1].getTime()}`;
    }
    const searchUrl = `/details?location=${encodeURIComponent(location)}${
      dateSearchString.length ? `&dates=${dateSearchString}` : ""
    }`;
    router.push(searchUrl);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await HotelService.getLocations();
      setLocations(locations);
      setFilteredLocations(locations);
    };
    fetchLocations();
    return () => {
      setLocations([]);
      setFilteredLocations([]);
    };
  }, []);

  return (
    <div>
      <div
        className="relative flex flex-col items-center justify-center h-[500px]"
        style={{
          backgroundImage: `url(${BgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-[70%] h-[100px] bg-white rounded-4xl flex items-center justify-center">
          <h1 className="lg:text-3xl md:text-4xl sm:text-2xl xs:text-xl font-semibold text-black">
            Relax, you’re booking at Hotel Finder
          </h1>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-2 mt-4 md:gap-4 w-full max-w-[60vw] relative">
          <div className="relative w-full">
            <div
              className={`flex items-center border rounded-lg px-3 py-2 cursor-pointer`}
              onClick={() => setDropdownOpen(true)}
            >
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Where to?"
                value={location}
                onChange={handleLocationChange}
                className="w-full outline-none text-gray-700"
                required
              />
            </div>

            {dropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-40 overflow-auto">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, index) => (
                    <li
                      key={index}
                      onClick={() => selectLocation(loc)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      {loc}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            )}
          </div>

          <div className="relative w-full">
            <div
              className="flex items-center border rounded-lg px-3 py-2 cursor-pointer"
              onClick={() => setCalendarOpen(!calendarOpen)}
            >
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                value={
                  dates
                    ? `${dates[0].toLocaleDateString()} - ${dates[1]?.toLocaleDateString()}`
                    : "Select Dates"
                }
                readOnly
                className="w-full outline-none text-gray-700 cursor-pointer"
                required
              />
            </div>

            {calendarOpen && (
              <div className="absolute z-10 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-2">
                <Calendar
                  selectRange
                  onChange={(value) => {
                    setDates(value as [Date, Date]);
                    setCalendarOpen(false);
                  }}
                  value={dates}
                />
              </div>
            )}
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700"
            onClick={handleSearch}
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </div>
      </div>

      <div>{locations.length && <Category locations={locations} />}</div>

      <div>
        <CardDetails />
      </div>
    </div>
  );
};

export default HomePage;
