const core = require("@actions/core");
const exec = require("@actions/exec");
const jsonfile = require("jsonfile");

const commands = {
  uploadFile: "arweave deploy",
};

const flags = {
  deploy: {
    ipfs: "--ipfs-publish",
    keyFile: "--key-file",
    package: "--package",
    skipConfirmation: "--force-skip-confirmation",
  },
};

const paths = {
  keyFile: "keyfile.json",
};

const outputs = {
  arweaveUrl: "arweave_url",
  ipfsUrl: "ipfs_url",
  cost: "cost",
};

async function run() {
  try {
    const inputs = {
      keyFileContent: JSON.parse(core.getInput("KEY_FILE_CONTENT")),
      filePath: core.getInput("FILE_PATH"),
      package: core.getInput("PACKAGE").toLowerCase() === "true",
      ipfs: core.getInput("IPFS").toLowerCase() === "true",
    };

    jsonfile
      .writeFile(paths.keyFile, inputs.keyFileContent)
      .then(async () => {
        const args = [
          inputs.filePath,
          flags.deploy.keyFile,
          paths.keyFile,
          flags.deploy.skipConfirmation,
          ...(inputs.package ? [flags.deploy.package] : []),
          ...(inputs.ipfs ? [flags.deploy.ipfs] : []),
        ];

        let commandOutput = "";
        const options = {
          listeners: {
            stdout: (data) => {
              commandOutput += data.toString();
            },
          },
        };

        await exec.exec(commands.uploadFile, args, options);

        const result = getResults(commandOutput, inputs.ipfs);

        core.setOutput(outputs.arweaveUrl, result.arweaveUrl);
        core.setOutput(outputs.ipfsUrl, result.ipfsUrl);
        core.setOutput(outputs.cost, result.cost);
      })
      .catch((error) => {
        core.setFailed(error.message);
      });
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getResults(output, ipfs) {
  // Ugly function, but the output data is not structured, just a huuge string
  const splittedOutput = output.split("\n");

  const indexes = {
    arweaveUrlIndex: splittedOutput.findIndex(e => e.includes("https://arweave.net")),
    ipfsUrlIndex: ipfs && splittedOutput.findIndex(e => e.includes("https://ipfs.io")),
    costIndex: splittedOutput.findIndex(e => e.includes("Price")),
  };

  return {
    arweaveUrl: splittedOutput[indexes.arweaveUrlIndex],
    ipfsUrl: ipfs ? splittedOutput[indexes.ipfsUrlIndex] : "",
    cost: splittedOutput[indexes.costIndex].split(" ")[1],
  };
}

run();
