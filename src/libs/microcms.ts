import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

const client = createClient({
    serviceDomain: import.meta.env.VITE_SERVICE_DOMAIN,  // ←ここが超重要
    apiKey: import.meta.env.VITE_API_KEY,
});

export const getBlogs = async (queries: MicroCMSQueries) => {
    return await client.get({ endpoint: "blogs", queries });
};

export const getBlogsDetail = async (blogId:string,
    queries?: MicroCMSQueries
) => {
    return await client.getListDetail({
        endpoint: "blogs",
        contentId:blogId,
        queries,
    });
};

