import { format, parseISO } from "date-fns";

// Format the default raw string value "yyyy-MM-dd" to --> MMMM d, yyyy
function formatDate(rawDate) {
   console.log(rawDate);
   // Parse the ISO date string to a Date object [we need this so we can take time zone issues into account]
   const selectedDate = parseISO(rawDate); 
   const formattedDate = format(selectedDate, "LLL d, yyyy");
   return formattedDate;
}

function getTodaysDate() {
	const date = new Date();

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = date.getFullYear();

	const todaysDate = `${year}-${month}-${day}`;
	console.log(todaysDate);
	return todaysDate;
}

export { formatDate, getTodaysDate };
