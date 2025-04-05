"use client";
import { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
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
  "addressline1",

  "rates_currency",
  "city",
  "state",
  "country",
  "longitude",
  "latitude",
  "overview",
  "checkin",
  "checkout",
  "numberrooms",
  "Standardroom",
  "Deluxeroom",
  "Suiteroom",
  "Penthouseroom",
];

const characterLimits: Record<string, number> = {
  hotel_name: 50,
  addressline1: 200,
  city: 80,
  state: 80,
  country: 80,
  longitude: 50,
  latitude: 50,
  overview: 1000,
  Standardroom: 100,
  Deluxeroom: 100,
  Suiteroom: 100,
  Penthouseroom: 100,
};

const HotelForm = ({
  isAdding,
  newHotel,
  editingHotel,
  setNewHotel,
  setEditingHotel,
  // handleAddNewHotel,
  // handleSaveEdit,
  setIsAdding,
}: HotelFormProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [checkoutDuration, setCheckoutDuration] = useState<12 | 24 | null>(
    null
  );

  const isFormValid = () => {
    const fields = isAdding ? newHotel : editingHotel;
    return requiredFields.every(
      (field) => fields?.[field] && fields[field] !== ""
    );
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);

    if (updatedImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRoomAllocation = (roomType: string, value: number) => {
    const totalRooms = Number(newHotel.numberrooms) || 0;
    const otherRoomCounts = [
      "Standardroom",
      "Deluxeroom",
      "Suiteroom",
      "Penthouseroom",
    ]
      .filter((type) => type !== roomType)
      .reduce(
        (sum, type) => sum + (Number(newHotel[type as keyof THotel]) || 0),
        0
      );

    if (otherRoomCounts + value > totalRooms) return;

    setNewHotel((prev) => ({ ...prev, [roomType]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg h-[70%] shadow-lg min-w-[60%] max-w-md">
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

      <div className="h-[80%] overflow-auto min-w-full max-w-md">
        {[
          ...requiredFields.filter(
            (f) =>
              ![
                "checkin",
                "checkout",
                "Standardroom",
                "Deluxeroom",
                "Suiteroom",
                "Penthouseroom",
                "rates_currency",
              ].includes(f)
          ),
        ].map((field) => (
          <div key={field} className="mb-2">
            <label className="block text-gray-700 mb-1 capitalize">
              {field.replace(/_/g, " ")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={field === "numberrooms" ? "number" : "text"}
                placeholder={field.replace(/_/g, " ")}
                className="border p-2 w-full"
                maxLength={characterLimits[field] || undefined}
                min={field === "numberrooms" ? 0 : undefined}
                value={
                  isAdding
                    ? newHotel[field as keyof THotel] || ""
                    : editingHotel?.[field as keyof THotel] || ""
                }
                onChange={(e) => {
                  let value = e.target.value;

                  if (field === "numberrooms") {
                    const num = Number(value);
                    value = num < 0 ? "0" : value;
                  }

                  isAdding
                    ? setNewHotel((prev) => ({ ...prev, [field]: value }))
                    : setEditingHotel((prev) =>
                        prev ? { ...prev, [field]: value } : prev
                      );
                }}
              />

              {characterLimits[field] && (
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                  {`${
                    isAdding
                      ? (newHotel[field as keyof THotel] as string)?.length || 0
                      : (editingHotel?.[field as keyof THotel] as string)
                          ?.length || 0
                  }/${characterLimits[field]}`}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Rates Currency (fixed to USD) */}

        {/* Room types under numberrooms */}
        {newHotel.numberrooms &&
          ["Standardroom", "Deluxeroom", "Suiteroom", "Penthouseroom"].map(
            (roomType) => (
              <div
                key={roomType}
                className="mb-2 flex flex-row items-center justify-between gap-2"
              >
                <div className="w-full ">
                  <label className="block text-gray-700 mb-1 capitalize">
                    {roomType} Count
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="border p-2 w-full pr-16"
                      min={0}
                      value={newHotel[roomType as keyof THotel] || ""}
                      onChange={(e) =>
                        handleRoomAllocation(roomType, Number(e.target.value))
                      }
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 bg-white px-1">
                      {newHotel[roomType as keyof THotel] || 0}/
                      {newHotel.numberrooms || 0}
                    </span>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 mb-1 capitalize">
                    {roomType} Price
                  </label>
                  <input
                    type="number"
                    className="border p-2 w-full"
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        [`${roomType}_price`]: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )
          )}
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">
            Rates Currency <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="border p-2 w-full bg-gray-100"
            value="USD"
            disabled
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">
            Checkout Duration <span className="text-red-500">*</span>
          </label>
          <select
            className="border p-2 w-full"
            value={checkoutDuration || ""}
            onChange={(e) => {
              const selected = Number(e.target.value) as 12 | 24;
              setCheckoutDuration(selected);
              setNewHotel((prev) => ({ ...prev, checkin: "", checkout: "" }));
            }}
          >
            <option value="">Select checkout duration</option>
            <option value={12}>12 Hours Checkout</option>
            <option value={24}>24 Hours Checkout</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 mb-1">
            Check-in <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            className="border p-2 w-full"
            disabled={!checkoutDuration}
            value={newHotel.checkin || ""}
            onChange={(e) => {
              const checkinTime = e.target.value;
              setNewHotel((prev) => {
                const [hours, minutes] = checkinTime.split(":").map(Number);
                const checkoutHour = (hours + (checkoutDuration || 0)) % 24;
                const checkoutTime = `${checkoutHour
                  .toString()
                  .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                return {
                  ...prev,
                  checkin: checkinTime,
                  checkout: checkoutTime,
                };
              });
            }}
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 mb-1">
            Check-out <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            className="border p-2 w-full bg-gray-100"
            readOnly
            value={newHotel.checkout || ""}
          />
        </div>
        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Image Upload</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="border p-2 w-full"
            onChange={handleImageChange}
            ref={fileInputRef}
          />

          <div className="grid grid-cols-3 gap-2 mt-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index}`}
                  className="h-24 w-full object-cover rounded border"
                />
                <p className="text-xs mt-1 truncate text-center">
                  {image.name}
                </p>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hidden group-hover:block"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
          
        </div>
        
      </div>
      {/* Save Button */}
{/* Save Button with Tooltip */}
<div className="mt-4 flex justify-end">
  <div className="relative group">
    <button
      // onClick={isAdding ? handleAddNewHotel : handleSaveEdit}
      disabled={!isFormValid()}
      className={`px-6 py-2 rounded font-semibold transition-all duration-200 ${
        isFormValid()
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Save
    </button>

    {!isFormValid() && (
      <div className="absolute -top-10 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        Fill all the required fields
      </div>
    )}
  </div>
</div>


    </div>
  );
};

export default HotelForm;
