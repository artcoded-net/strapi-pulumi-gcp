import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Database Instance

const dbInstance = new gcp.sql.DatabaseInstance("strapi-db", {
  name: "strapi-postgres-db", // GCP resource name
  databaseVersion: "POSTGRES_13",
  deletionProtection: true,
  settings: {
    tier: "db-f1-micro",
    backupConfiguration: {
      enabled: true,
      pointInTimeRecoveryEnabled: true,
      backupRetentionSettings: {
        retainedBackups: 7,
      },
    },
    databaseFlags: [
      // these flags are passed directly to the DB engine (Postgres in our case)
      {
        name: "max_connections",
        value: "100",
      },
    ],
    /*
    ipConfiguration: {
        authorizedNetworks: [
            {
                name: 'my-office-network', // a name for this entry (you decide this name)
                value: '192.168.1.1' // the IP address to be whitelisted
            }
        ]
    }
    */
  },
  /*
  clone: {
    // if populated, do not create db instance from scratch
    sourceInstanceName: "my-existing-instance",
  },
  */
});

// Database User

const dbUser = new gcp.sql.User("database-user", {
  instance: dbInstance.name,
  deletionPolicy: "ABANDON",
  name: "postgres",
  password: "Bk9zgpgCQI", // later we are going to protect and encrypt this password
});

export const connectionString = dbInstance.connectionName;
export const publicIP = dbInstance.publicIpAddress;
