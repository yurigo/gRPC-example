require("dotenv").config();

// Leemos el schema y lo cargamos
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "schema", "Services.proto"),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        arrays: true,
        oneofs: true,
    }
);
const { VideogameService } = grpc.loadPackageDefinition(packageDefinition);

const port = process.env.PORT || 3000;

const server = new grpc.Server();

const { all, add } = require("./controller");

server.addService(VideogameService.service, {
    all: all,
    add: add,
});

server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        server.start();
        console.log(`gRPC Server running on port ${port}`);
    }
);
