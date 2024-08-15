// Function to calculate relative time
const getRelativeTime = (date) => {
    const now = new Date();
    const pastDate = new Date(date);
    const difference = Math.floor((now - pastDate) / 1000); // Difference in seconds

    if (difference < 60) {
      return `${difference} sec ago`;
    } else if (difference < 3600) {
      return `${Math.floor(difference / 60)} min ago`;
    } else if (difference < 86400) {
      return `${Math.floor(difference / 3600)} hr ago`;
    } else if (difference < 2592000) { // Approx. 30 days
      return `${Math.floor(difference / 86400)} days ago`;
    } else if (difference < 31536000) { // Approx. 365 days
      return `${Math.floor(difference / 2592000)} months ago`;
    } else {
      return `${Math.floor(difference / 31536000)} years ago`;
    }
  };
export default getRelativeTime