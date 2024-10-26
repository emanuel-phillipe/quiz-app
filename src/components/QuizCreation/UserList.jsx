import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

function UserList({fetchedUsers}) {

  return (
    <div>
      {fetchedUsers.map((user) => {
        <div>
          <p>{user.fullName}</p>
          <p>{user.email}</p>
        </div>
      })}
    </div>
  )
}

export default UserList