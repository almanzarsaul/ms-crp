/**
 * Adds days to date.
 * @param {Date} [date=Date.now()] Date object that days will be added to.
 * @param days How many days will be added to Date object.
 * @returns {Date} Date object with days added to it.
 * Created by Saul Almanzar
 */
export default function addDays(
  date: Date = new Date(Date.now()),
  days: number
): Date {
  const newDate: Date = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}
