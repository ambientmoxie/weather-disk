export default {
  root: "src",
  base: "/weather-disk",
  envDir: "../",
  server: { host: true },
  build: {
    outDir: "../dist",
    chunkSizeWarningLimit: 1000,
  },
};
