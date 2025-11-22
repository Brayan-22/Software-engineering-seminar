import api from "./Api"

export const advancedSearch = async (search_term: string) => {
    const res = await api.post("/search/advanced", {search_term});
    return res.data;
}