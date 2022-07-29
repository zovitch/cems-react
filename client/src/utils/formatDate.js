function formatDate(date) {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  return formattedDate;
}

export default formatDate;
