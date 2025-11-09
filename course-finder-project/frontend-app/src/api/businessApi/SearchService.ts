import api from "./Api"

export const advancedSearch = async (professor: string) => {
    const res = await api.post("/search/advanced", {professor, course: "a"});
    return res.data;
}