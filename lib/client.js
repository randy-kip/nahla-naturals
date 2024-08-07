import sanityClient from "@sanity/client";

import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: "80cjm1gx",
  dataset: "production",
  apiVersion: "2024-03-18",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
