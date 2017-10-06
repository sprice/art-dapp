module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      // from: "0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E" // Shawn's Metamask Address
      from: ""
    }
  }
};
