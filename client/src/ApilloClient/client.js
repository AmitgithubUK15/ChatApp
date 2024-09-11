import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_APP_APOLLO_URI,
    credentials: 'include',
});

const authLink = setContext((_, { headers}) => {
    const token = localStorage.getItem('S_ID'); 
    return {
        headers: {
            ...headers,
            authorization: token ? token : "",
            
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
