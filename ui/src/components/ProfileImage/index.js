import React from 'react';
import { Link } from 'react-router-dom';

export function ProfileImage({user, size}) {
    let img;
    if (user.image) {
        img = (
            <img
                className="ProfileImage"
                style={{
                    width: (size || 40) + 'px',
                    height: (size || 40) + 'px',
                    borderRadius: '999px',
                    border: '1px solid #72757a',
                }}
                src={ user.image || "/static/img/generic.png" }
                alt={ `${user.first_name} ${user.last_name}` }
            />
        );
    } else {
        img = (
            <div
                className="ProfileImage"
                style={{
                    width: (size || 40) + 'px',
                    height: (size || 40) + 'px',
                    borderRadius: '999px',
                    color: '#2b2c34',
                    border: '1px solid #72757a',
                    backgroundColor: '#f5f5f5',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontSize: (size / 3) + 'px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                children={
                    user.first_name.slice(0,1) + user.last_name.slice(0,1)
                }
            />
        );
    }
    return <Link to={ `/users/${user.username}` }>{ img }</Link>;
}
