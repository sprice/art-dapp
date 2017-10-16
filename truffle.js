module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      from: ""
    },
    rinkeby: {
      host: "localhost", // Connect to local geth
      port: 8545,
      from: "0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E", // Shawn's Metamask Address
      network_id: 4,  // Rinkeby network
      gas: 4000000 // Gas limit used for deploys
    }
  }
};
