import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContextProvider';

const axiosSecure = axios.create({
    baseURL: `https://student-colabroration-server.vercel.app`,
    withCredentials: true,
});

const useAxiosSecureApi = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(config => {
        return config;
    }, error => {
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error.status;
        // if (status === 403) {
        //     navigate('/forbidden');
        // }
        // else if (status === 401) {
        //     logOut()
        //         .then(() => {
        //             navigate('/login')
        //         })
        //         .catch(() => { })
        // }

        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxiosSecureApi;