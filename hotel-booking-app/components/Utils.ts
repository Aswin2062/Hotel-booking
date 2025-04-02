export function convertTo24HourFormat(time12hr: string) {
  const [time, modifier] = time12hr.split(" "); // Split into time and AM/PM
  let [hours, minutes] = time.split(":"); // Split hours and minutes

  // Convert the hour to a number
  let hrsInNumber = parseInt(hours);

  // Handle AM/PM conversions
  if (modifier === "AM") {
    // If it's 12 AM, convert to 00 (midnight)
    if (hrsInNumber === 12) {
      hrsInNumber = 0;
    }
  } else if (modifier === "PM") {
    // If it's PM and the hour isn't 12, add 12
    if (hrsInNumber !== 12) {
      hrsInNumber += 12;
    }
  }

  // Format hours and minutes to ensure two digits
  return `${String(hrsInNumber).padStart(2, "0")}:${minutes}`;
}
