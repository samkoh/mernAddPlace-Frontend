import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

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

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const placeId = useParams().placeId;
    const history = useHistory();

    // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);



    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:4000/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.description,
                        isValid: true
                    }
                }, true);
            } catch (err) { }

        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);


    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:4000/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            );
            history.push('/' + auth.userId + '/places');
        } catch (err) { }
    };


    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        );
    }

    if (!loadedPlace & !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find a place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true}
                />
                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (min. 5 characters)."
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                />
                <Button type='submit' disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>)}
        </React.Fragment>
    );
};

export default UpdatePlace;