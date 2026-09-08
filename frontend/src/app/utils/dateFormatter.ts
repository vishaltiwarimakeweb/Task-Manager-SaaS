export const dateFormatter = (doc: string) => {
  const docString = doc.toString();
  const year = docString.slice(0, 4);

  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month: number = Number(docString.slice(5, 7));
  const day = docString.slice(8, 10);
  const realMonth = allMonths[month - 1];
  return `${day}/${realMonth}/${year}`;
};
