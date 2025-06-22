const { BlobServiceClient } = require('@azure/storage-blob');
const connectionString = process.env.AzureWebJobsStorage;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = "counter";
const blobName = "count.txt";

module.exports = async function (context, req) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    const blobClient = containerClient.getBlockBlobClient(blobName);
    let count = 0;
    if (await blobClient.exists()) {
      const downloadBlockBlobResponse = await blobClient.downloadToBuffer();
      count = parseInt(downloadBlockBlobResponse.toString()) || 0;
    }
    count++;
    await blobClient.upload(count.toString(), count.toString().length);
    context.res = { body: `Odwiedziny: ${count}` };
  } catch (err) {
    context.res = { status: 500, body: `Błąd: ${err}` };
  }
};
