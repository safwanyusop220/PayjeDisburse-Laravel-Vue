import axios from "axios"

export const GuardedApi = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return axios;
}
