// Importing necessary modules from the Azure Storage Blob SDK
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

// Defining the name of the container to use
export const containerName = "posts";

// Retrieving Azure Storage account name and access key from environment variables
const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY;

// Checking if account name or access key is missing
if (!accountName || !accountKey) {
  throw new Error("Azure Storage account name and key are required");
}

// Creating a StorageSharedKeyCredential object using the account name and access key
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

// Creating a BlobServiceClient object using the account URL and shared key credential
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Async function to generate a SAS token with permissions to read, write, and create blobs
async function generateSASToken() {
  // Getting the container client for the specified container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Setting permissions for the SAS token
  const permissions = new BlobSASPermissions();
  permissions.write = true;
  permissions.create = true;
  permissions.read = true;

  // Setting the expiration date for the SAS token (30 minutes from now)
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 30);

  // Generating the SAS token using the BlobSASQueryParameters
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      permissions: permissions,
      expiresOn: expiryDate,
    },
    sharedKeyCredential
  ).toString();

  // Returning the generated SAS token
  return sasToken;
}

// Exporting the generateSASToken function as the default export
export default generateSASToken;
