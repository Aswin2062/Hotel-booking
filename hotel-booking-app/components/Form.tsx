"use client";
import { FaTimes, FaSave } from "react-icons/fa";
import { THotel } from "@/dao";

interface HotelFormProps {
  isAdding: boolean;
  newHotel: Partial<THotel>;
  editingHotel: THotel | null;
  setNewHotel: React.Dispatch<React.SetStateAction<Partial<THotel>>>;
  setEditingHotel: React.Dispatch<React.SetStateAction<THotel | null>>;
  handleAddNewHotel: () => void;
  handleSaveEdit: () => void;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

const requiredFields: (keyof THotel)[] = [
  "hotel_name",
  "hotel_formerly_name",
  "addressline1",
  "addressline2",
  "city",
  "state",
  "country",
  "url",
  "overview",
  "numberrooms",
];

const HotelForm = ({
  isAdding,
  newHotel,
  editingHotel,
  setNewHotel,
  setEditingHotel,
  handleAddNewHotel,
  handleSaveEdit,
  setIsAdding,
}: HotelFormProps) => {
  const isFormValid = () => {
    const fields = isAdding ? newHotel : editingHotel;
    return requiredFields.every(
      (field) => fields?.[field] && fields[field] !== ""
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg h-[70%]   shadow-lg w-full max-w-md">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold mb-4">
          {isAdding ? "Add New Hotel" : "Edit Hotel"}
        </h2>
        <button
          onClick={() =>
            isAdding ? setIsAdding(false) : setEditingHotel(null)
          }
          className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
        >
          <FaTimes />
        </button>
      </div>

      <div className="h-[80%] overflow-auto w-full max-w-md">
        {[
          "brand_name",
          "hotel_name",
          "hotel_formerly_name",
          "hotel_translated_name",
          "addressline1",
          "addressline2",
          "zipcode",
          "city",
          "state",
          "country",
          "countryisocode",
          "longitude",
          "latitude",
          "url",
          "numberrooms",
          "overview",
          "continent_name",
          "rates_currency",
        ].map((field) => (
          <div key={field} className="mb-2">
            <label className="block text-gray-700 mb-1">
              {field.replace(/_/g, " ")}
              {requiredFields.includes(field as keyof THotel) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              placeholder={field.replace(/_/g, " ")}
              className="border p-2 w-full"
              value={
                (isAdding
                  ? newHotel[field as keyof THotel]
                  : editingHotel?.[field as keyof THotel]) || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (isAdding) {
                  setNewHotel(
                    (prev) => ({ ...prev, [field]: value } as Partial<THotel>)
                  );
                } else {
                  setEditingHotel((prev) =>
                    prev ? ({ ...prev, [field]: value } as THotel) : prev
                  );
                }
              }}
            />
          </div>
        ))}

        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={isAdding ? newHotel.photo1 : editingHotel?.photo1 || ""}
            onChange={(e) => {
              const value = e.target.value;
              isAdding
                ? setNewHotel({ ...newHotel, photo1: value })
                : setEditingHotel((prev) =>
                    prev ? ({ ...prev, photo1: value } as THotel) : prev
                  );
            }}
          />
        </div>

        {(isAdding ? newHotel.photo1 : editingHotel?.photo1) && (
          <img
            src={isAdding ? newHotel.photo1 : editingHotel?.photo1}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md mb-2"
          />
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={isAdding ? handleAddNewHotel : handleSaveEdit}
          disabled={!isFormValid()}
          className={`bg-green-500 text-white flex flex-row items-center justify-between px-4 py-2 rounded hover:bg-green-600 ${
            !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaSave className="mr-2" /> Save
        </button>
      </div>
    </div>
  );
};

export default HotelForm;
