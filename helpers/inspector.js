function checkMemoryUsage() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory in use ${Math.round(used * 100) / 100} MB`);
}
module.exports = {
  checkMemoryUsage,
};
