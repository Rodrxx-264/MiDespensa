const config = {
  appId: "com.midespensa.app",
  appName: "Mi Despensa",
  webDir: "out",
  server: {
    url: process.env.CAPACITOR_SERVER_URL,
    cleartext: false,
  },
  android: {
    backgroundColor: "#f4f4ef",
  },
};

export default config;
