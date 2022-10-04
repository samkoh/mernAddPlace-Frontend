import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import App from '../../App';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'TRX Exchange',
//         description: 'Once of the high sky scappers in the world!',
//         imageUrl: 'https://assets.nst.com.my/images/articles/exchangtr_1656388298.jpg',
//         address: 'Unit M-02, Level 2, TREC Multi Level Building, 438, Jln Tun Razak, Tun Razak Exchange, 50400 Kuala Lumpur',
//         location: {
//             lat: 3.1392666,
//             lng: 101.721416
//         },
//         creator: 'u1'
//     },

//     {
//         id: 'p2',
//         title: 'PNB 118',
//         description: 'Second tallest building in the world!',
//         imageUrl: 'https://www.moment-solutions.com/wp-content/uploads/2018/02/KL118-118-Floors.jpg',
//         address: 'Cangkat Stadium, City Centre, 50150 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
//         location: {
//             lat: 3.1392666,
//             lng: 101.721416
//         },
//         creator: 'u2'
//     }
// ];

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    // the userId is returned from the url path set in App.js
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (err) { };
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

    const placeDeletedHandler = deletedPlaceId => {
        setLoadedPlaces(prevPlaces =>
            prevPlaces.filter(place => place.id !== deletedPlaceId)
        );
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && 
            (<PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
            )}
        </React.Fragment>
    );
};

export default UserPlaces;