import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'; // We'll customize this

dayjs.extend(relativeTime);

// Hausa month names
const hausaMonths = [
  'Janairu', 'Fabrairu', 'Maris', 'Afrilu', 'Mayu', 'Yuni',
  'Yuli', 'Agusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'
];

// Hausa day names
const hausaDays = [
  'Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis', 'Jumma\'a', 'Asabar'
];

/**
 * Format date in Hausa
 * @param date - Date string or Date object
 * @param format - 'full' | 'short' | 'relative'
 */
export function formatHausaDate(date: string | Date, format: 'full' | 'short' | 'relative' = 'short'): string {
  const d = dayjs(date);
  
  if (format === 'relative') {
    const now = dayjs();
    const diffInHours = now.diff(d, 'hour');
    const diffInDays = now.diff(d, 'day');
    
    if (diffInHours < 1) {
      const minutes = now.diff(d, 'minute');
      return minutes < 1 ? 'Yanzu' : `Minti ${minutes} da suka wuce`;
    } else if (diffInHours < 24) {
      return `Awa ${diffInHours} da suka wuce`;
    } else if (diffInDays < 7) {
      return `Kwana ${diffInDays} da suka wuce`;
    }
  }
  
  const day = d.date();
  const month = hausaMonths[d.month()];
  const year = d.year();
  const dayName = hausaDays[d.day()];
  
  if (format === 'full') {
    return `${dayName}, ${day} ${month}, ${year}`;
  }
  
  return `${day} ${month}, ${year}`;
}

/**
 * Get reading time in Hausa
 * @param content - Article content
 * @param wordsPerMinute - Average reading speed (default: 200)
 */
export function getReadingTime(content: string, wordsPerMinute: number = 200): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  if (minutes === 1) {
    return '1 minti karatu';
  }
  
  return `${minutes} minti karatu`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
