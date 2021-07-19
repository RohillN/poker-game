import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as CgIcons from 'react-icons/cg';
// override icon css: https://github.com/react-icons/react-icons#configuration
// https://react-icons.github.io/icons?name=fa *** ICONS LINK ***
 
const iconSize = 20;
const iconColor = "#C5C6C7";

export const GuestNavBarData = [
    {
        title: 'Home',
        path: '/home',
        icon: <AiIcons.AiFillHome size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    },
    {
        title: 'Guest',
        path: '/guest',
        icon: <FaIcons.FaUserSecret size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    }
]

export const AuthNavBarData = [
    {
        title: 'Home',
        path: '/home',
        icon: <AiIcons.AiFillHome size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    },
    {
        title: 'Rooms',
        path: '/rooms',
        icon: <CgIcons.CgProfile size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    },
    {
        title: 'Game',
        path: '/game',
        icon: <FaIcons.FaTasks size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    },
]

export const RoomCRUD = [
    {
        title: 'Create Room',
        path: '/rooms/create',
        icon: <CgIcons.CgProfile size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    },
    {
        title: 'Edit Room',
        path: '/rooms/edit',
        icon: <CgIcons.CgProfile size={iconSize} style={{color: iconColor}} />,
        cName: 'nav-text'
    }
]