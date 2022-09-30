import React from 'react';

import './MainHeader.css';

const MainHeader = props => {
    //props.children is the placeholder for the element of the child
    return <header className='main-header'>{props.children}</header>;
};

export default MainHeader;