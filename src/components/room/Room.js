import { Button, Container } from '@material-ui/core';
import React from 'react';
import { RoomCRUD } from '../navigation/NavBarData';
import DisplayRoom from './DisplayRoom';

class Room extends React.Component {


    render() {
        return (
            <Container maxWidth="md">
                <h1 className="headingOne">Room Page</h1>
                {RoomCRUD.map((item, index) => (
                    <Button key={`button-${item}-${index}`} style={{margin: "10px"}} variant="contained" color="primary" onClick={() => { window.location = item.path }} disabled={item.path === "/rooms/edit" ? true : false}>{item.title}</Button>
                ))}
                <DisplayRoom />
            </Container>
        );
    }
}

export default Room;
