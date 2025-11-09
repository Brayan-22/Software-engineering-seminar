import api from "./Api"

export const advancedSearch = async (professor: string, course: string) => {
    const res = await api.post("/search/advanced", {professor, course});
    return res.data;
}