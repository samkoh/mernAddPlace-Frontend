import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    // const USERS = [{
    //     id: 'u1',
    //     image: 'https://a-z-animals.com/media/2021/12/funny-goat-puts-out-its-tongue-picture-id177369626-1024x535.jpg',
    //     name: 'Donny',
    //     places: '2'
    // }];
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users'
                );
                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        fetchUsers();
    }, [sendRequest]);

    // The 'items' is the self created name  
    return (

        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (<div className='center'>
                <LoadingSpinner />
            </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    );
};

export default Users;