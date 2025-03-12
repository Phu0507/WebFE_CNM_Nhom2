import React from 'react'
import Avatar from '../../assets/user-circle.svg'
import Input from '../../components/input'

const Dashboard = () => {
  const contacts = [
    {
      id: 1,
      name: 'Nguyen Van A',
      status: 'available',
      img: Avatar,
    },
    {
      id: 2,
      name: 'Nguyen Van B',
      status: 'available',
      img: Avatar,
    },
    {
      id: 3,
      name: 'Nguyen Van C',
      status: 'available',
      img: Avatar,
    },
    {
      id: 4,
      name: 'Nguyen Van D',
      status: 'available',
      img: Avatar,
    },
    {
      id: 5,
      name: 'Nguyen Van E',
      status: 'available',
      img: Avatar,
    },
    {
      id: 6,
      name: 'Nguyen Van F',
      status: 'available',
      img: Avatar,
    },
    {
      id: 7,
      name: 'Nguyen Van G',
      status: 'available',
      img: Avatar,
    },
  ]
  return (
    <div className='w-screen flex'>
        <div className='w-[25%] border h-screen bg-secondary'>
          <div className='flex items-center h-[100px] my-8 mx-14'>
            <div className='border border-primary rounded-full p-[2px]'>
                <img src={Avatar} alt='' height={70} width={70}/>
            </div>
            <div className='ml-8'>
                <h3 className='text-2xl'>Admin</h3>
                <p className='text-lg font-light'>My account</p>
            </div>
          </div>
          <hr/>
          <div className='mx-14 w-[326px]'>
            <div className='h-[560px] overflow-y-scroll'>
              {
                contacts.map(({id, name, status, img}) => {
                  return(
                    <div className='flex items-center py-4 border-b border-b-gray-300'>
                      <div className='cursor-pointer flex items-center'>
                        <div><img src={Avatar} alt='' height={55} width={55}/></div>
                        <div className='ml-5'>
                          <h3 className='text-lg font-semibold'>{name}</h3>
                          <p className='text-sm font-light text-gray-600'>{status}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
                
              }
            </div>
          </div>

        </div>
        <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
              <div className='w-[75%] bg-secondary h-[70px] my-5 rounded-full flex items-center px-7'>
                  <div className='cursor-pointer'><img src={Avatar} alt='' height={55} width={55}/></div>
                  <div className='ml-2 mr-auto'>
                      <h3 className='text-lg'>Dao Thanh Phu</h3>
                      <p className='text-sm font-light text-gray-600'>Online</p>
                  </div>
                  <div className='cursor-pointer'>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="black"  stroke-width="2"  
                    stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
                  </div>
              </div>
              <div className='h-[75%] w-full overflow-y-scroll shadow-sm'>
                  <div className='h-[1000px] px-7 py-14'>
                    <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto text-white p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto text-white p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto text-white p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                    <div className='max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto text-white p-4 mb-6'>
                        toi la ai tren the gioi nay vaayj ha cac ban oi
                    </div>
                  </div>
              </div>
              <div className='p-7 w-full flex items-center'>
                <div className='w-[75%]'>
                <Input placeholder='Type a message' className='w-full p-4 border-0 shadow-md rounded-full bg-gray-200 focus:ring-0 
                focus:border-0 outline-none' />
                </div>
                <div className='cursor-pointer ml-2 p-2 rounded-full bg-light'>
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-photo">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
                  <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" /></svg>
                </div>
                <div className='cursor-pointer p-2 rounded-full bg-light'>
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-files">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 3v4a1 1 0 0 0 1 1h4" /><path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
                  <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" /></svg>
                </div>
                <div className='cursor-pointer p-2 rounded-full bg-light'>
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-sticker-2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h12a2 2 0 0 1 2 2v7h-5a2 2 0 0 0 -2 2v5h-7a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z" />
                  <path d="M20 13v.172a2 2 0 0 1 -.586 1.414l-4.828 4.828a2 2 0 0 1 -1.414 .586h-.172" /></svg>
                </div>
                <div className='cursor-pointer p-2 rounded-full bg-light'>
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  
                    stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
                    class="icon icon-tabler icons-tabler-outline icon-tabler-send">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                </div>
              </div>
        </div>
        
        <div className='w-[25%] border h-screen'></div>

    </div>
  )
}

export default Dashboard