import {useCookies} from 'react-cookie';

export const useToken = () => {
    const [Cookies,_] = useCookies(["access_token"]);
    
    return { headers: { authorization: Cookies.access_token } };
}