import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Socket from './Socket';

export default function Home() {

  return (
    <div>Home
     <Socket />
    </div>
  )
}
