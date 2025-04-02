export const HotelService = {
  getLocations: async () => {
    try {
      const res = await fetch("/api/locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
    return [];
  },

  getDiscountHotels: async () => {
    try {
      const res = await fetch("/api/discountHotels", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
    return [];
  },

  getHotelsByLocation: async (location: string) => {
    try {
      const res = await fetch(`/api/hotels?location=${location}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
    return [];
  },
};
