function formatDateTime(date) {
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const formattedTime = new Date(date)
    .toISOString()
    .split('T')[1]
    .substring(0, 5);
  return formattedDate + 'T' + formattedTime;
}

export default formatDateTime;
