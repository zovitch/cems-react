function nth(n) {
  return (
    n + ['st', 'nd', 'rd'][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] ||
    n + 'th'
  );
}
export default nth;
