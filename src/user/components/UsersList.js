import React from 'react';
import './UsersList.css';
import UserItem from './UserItem';

const UsersList = props => {
    // items name is set by you, any name also can
    if (props.items.length === 0) {
        return (<div className='center'>
            <h2>NO users found.</h2>
        </div>
        );
    }

    return (
        <ul className='users-list'>
            {props.items.map(user => (
                /* user name whatever name that you set */
                /* Need to include key element */
                < UserItem
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    placeCount={user.places.length}
                />
            ))}
        </ul>
    );
};

export default UsersList; 