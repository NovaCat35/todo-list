import { format } from 'date-fns'

// Format the default raw string value "mm-dd-yyyy" to --> MMMM d, yyyy
export default function formatDate(rawDate) {
   console.log(rawDate)
   const selectedDate = new Date(rawDate); // Convert the value to a Date object
   const formattedDate = format(selectedDate, 'MMMM d, yyyy');
   return formattedDate;
}