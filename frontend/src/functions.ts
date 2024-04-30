export function timeElapsed(time: string){
    const currentTime = new Date();
    const newsTime = new Date(time);
    const difference = currentTime.getTime() - newsTime.getTime();
    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); 
    const years = Math.floor(days / 365);
    if (minutes < 60) {
      if(minutes === 1) return `${minutes} minute ago` 
      else return `${minutes} minutes ago`;
    }
    else if (hours < 24) {
      if(hours === 1) return `${hours} hour ago`
      else return `${hours} hours ago`;
    }
    else if (days < 7) {
      if(days === 1) return `${days} day ago`
      else return `${days} days ago`;
    }
    else if (weeks < 4) {
      if(weeks === 1) return `${weeks} week ago`
      else return `${weeks} weeks ago`;
    }
    else if (months < 12) {
      if(months === 1) return `${months} month ago`
      else return `${months} months ago`;
    }
    else {
      if(years === 1) return `${years} year ago`
      else return `${years} years ago`;
    }
  }