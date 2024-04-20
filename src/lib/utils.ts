import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const  formatRelativeTime = (dateString: string): string => {
    const currentDate = new Date();
    const pastDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - pastDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    if (secondsDifference < 60) {
      return `${secondsDifference} seconds ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minutes ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hours ago`;
    } else if (daysDifference < 7) {
      return `${daysDifference} days ago`;
    } else if (daysDifference < 30) {
      const weeksDifference = Math.floor(daysDifference / 7);
      return `${weeksDifference} week${weeksDifference > 1 ? "s" : ""} ago`;
    } else if (daysDifference < 365) {
      const monthsDifference = Math.floor(daysDifference / 30);
      return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
    } else {
      const yearsDifference = Math.floor(daysDifference / 365);
      return `${yearsDifference} year${yearsDifference > 1 ? "s" : ""} ago`;
    }
  }

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
