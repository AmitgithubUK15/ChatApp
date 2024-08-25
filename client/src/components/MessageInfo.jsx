import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showMsgInfo } from '../redux/chatinguserlist/MessageInfoSlice';
import { Selected_Msgs, ShowCheckBoxs_Visiblity } from '../redux/chatinguserlist/ChatList';
import { gql, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const GetMessageInfo_gql = gql`
mutation getMsgInfo($msg_id:String!){
    GiveMessageInfo(message_id:$msg_id){
       senderId,
       msg,
       FileMsg{
       url,
       type,
       filename
       },
       Date,
       Time,
       Day
    }
}
`

export default function MessageInfo() {
    const [GiveMessageInfo,] = useMutation(GetMessageInfo_gql);

    const { selectedmsg } = useSelector((state) => state.chat);
    const { S_UID } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [Data, setData] = useState(null);

    //  Back to chat page
    function GobackinChatbox() {
        let clearSelectmsg = {
            Messages_id: [],
            filemsgs_details: []
        }
        dispatch(showMsgInfo(false))
        dispatch(ShowCheckBoxs_Visiblity(false))
        dispatch(Selected_Msgs(clearSelectmsg))

    }

    useEffect(() => {
        findmsg_info()
    }, [selectedmsg])

    async function findmsg_info() {
        try {

            const { data } = await GiveMessageInfo({ variables: { msg_id: selectedmsg.Messages_id[0] } })

            if (data) {
                setData(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    function splittime(time) {
        if (time) {
            let split = time.split(' ');

            let first = split[0].split(':');
            let log = `${first[0]} : ${first[1]} ${split[1]}`;
            return log;
        }
    }
    return (
        <div >
            <div className='px-5'>

                <div className='py-5  flex gap-4'>
                    <div>
                        <button onClick={GobackinChatbox} className=' text-2xl font-bold'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </div>
                    <div>
                        <h1>
                            <span className='text-xl font-semibold'>
                                Message Info
                            </span>
                        </h1>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div>
                        <div className='py-8 bg-gray-50'>
                            <h1 className='px-2'>

                                {/* If Message Available */}

                                {Data && Data.GiveMessageInfo.msg !== "" &&
                                    (
                                        <>
                                            <span className={Data && S_UID._id === Data.GiveMessageInfo.senderId ? `bg-purple-700 inline-block shadow-xl p-2 text-md font-semibold rounded-xl text-white`
                                                : `bg-slate-300 p-2 inline-block shadow-xl text-md font-semibold rounded-xl text-purple-black`
                                            }>{Data && Data.GiveMessageInfo.msg}
                                                <span className='font-normal  mx-1 text-[9px] '>{splittime(Data && Data.GiveMessageInfo.Time)}</span>

                                            </span>
                                        </>
                                    )}
                                  
                                  {/* If file type Message available */}
                                        
                                    {Data && Data.GiveMessageInfo.FileMsg[0].type !=="" && 
                                     <div>
                                     {Data && Data.GiveMessageInfo.FileMsg[0].type !== "video/mp4" ?
                                         (
                                             <div className='w-64 h-48 p-1 overflow-hidden '>
                                                 <img src={Data && Data.GiveMessageInfo.FileMsg[0].url} alt="" className='w-full h-full' />
                                             </div>
                                         )
                                         :
                                         (
                                             <div className='w-64 h-48 p-1 overflow-hidden '>
                                                 <video className='max-w-[100%] rounded-md' controls>
                                                     <source src={Data && Data.GiveMessageInfo.FileMsg[0].url} alt={Data && Data.GiveMessageInfo.FileMsg[0].filename} />
                                                 </video>
                                             </div>
                                         )
                                     }
                                 </div>
                                    }
                                    
                                   
                            </h1>
                        </div>
                    </div>

                    <div>
                        <div className='py-8 bg-gray-50'>
                            <h1 className='px-2'>
                                <p className='font-semibold'> <span className='font-semibold'>Date :</span> {Data && Data.GiveMessageInfo.Date} </p>
                                <p className='font-semibold'><span className='font-semibold'>Time :</span> {Data && Data.GiveMessageInfo.Time} </p>
                                <p className='font-semibold'><span className='font-semibold'> Day :</span> {Data && Data.GiveMessageInfo.Day} </p>
                            </h1>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
